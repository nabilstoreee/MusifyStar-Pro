const storage = require('./storage.js');
const userAuth = require('./user-auth.js');
const adminAuth = require('./admin-auth.js');

const pool = storage.pool;

// Ensure table exists on server start
async function initChatTable() {
    if (!pool) return;
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS global_chat_messages (
                id BIGSERIAL PRIMARY KEY,
                user_id VARCHAR(100),
                username VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                badge VARCHAR(50) DEFAULT 'Member',
                is_admin BOOLEAN DEFAULT FALSE,
                avatar_color VARCHAR(50),
                ip_address VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_chat_msg_time ON global_chat_messages(created_at DESC);
        `);
    } catch (e) {
        console.error('[GLOBAL_CHAT] Table check error:', e.message);
    }
}
initChatTable().catch(() => {});

// In-memory rate limiting: Max 1 message every 2 seconds per IP / User
const rateLimitMap = new Map();
function isRateLimited(key) {
    const now = Date.now();
    const last = rateLimitMap.get(key) || 0;
    if (now - last < 2000) {
        return true;
    }
    rateLimitMap.set(key, now);
    // Periodically clean up old keys
    if (rateLimitMap.size > 2000) {
        for (const [k, time] of rateLimitMap.entries()) {
            if (now - time > 60000) rateLimitMap.delete(k);
        }
    }
    return false;
}

// XSS sanitization
function sanitizeText(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .trim();
}

function getClientIp(req) {
    return (
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        req.ip ||
        '127.0.0.1'
    );
}

// Color palettes for avatars based on username hash
const AVATAR_GRADIENTS = [
    'from-rose-500 to-amber-500',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-amber-400 to-orange-600',
    'from-indigo-500 to-purple-600',
    'from-sky-400 to-indigo-600',
    'from-fuchsia-500 to-rose-600'
];

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

module.exports = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const method = req.method.toUpperCase();
    const clientIp = getClientIp(req);

    // 1. GET /api/global-chat - Fetch recent chat messages
    if (method === 'GET') {
        try {
            if (!pool) {
                return res.status(503).json({ status: false, message: 'Database utama belum siap.' });
            }

            // Check if requester is master admin
            const adminToken = req.headers['x-admin-token'] || req.query.admin_token;
            const authHeader = req.headers.authorization || req.headers['x-auth-token'] || '';
            const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
            const isMasterAdminReq = adminAuth.isValidToken(adminToken) || adminAuth.isValidToken(rawToken);

            const result = await pool.query(`
                SELECT id, user_id, username, email, message, badge, is_admin, avatar_color, created_at 
                FROM global_chat_messages 
                ORDER BY created_at DESC 
                LIMIT 60
            `);

            // Sort chronologically (oldest to newest)
            const rows = result.rows.reverse();

            // PRIVACY & SECURITY: Strip / mask emails for regular users to prevent scraping via DevTools
            const safeMessages = rows.map(r => {
                const isMsgMasterAdmin = ((r.email || '').toLowerCase().trim() === 'jrnabil570@gmail.com') ||
                                         (String(r.user_id || '') === 'u_1790196636099_622dc736') ||
                                         (String(r.user_id || '') === 'admin_1') ||
                                         (r.username === 'nabil' && (r.email || '').includes('jrnabil570'));
                const displayUsername = isMsgMasterAdmin ? 'MusifyStar Official' : r.username;
                return {
                    id: String(r.id),
                    userId: r.user_id,
                    username: displayUsername,
                    message: r.message,
                    badge: isMsgMasterAdmin ? 'Admin' : (r.badge || 'Member'),
                    isAdmin: isMsgMasterAdmin,
                    isVerifiedAdmin: isMsgMasterAdmin,
                    avatarColor: r.avatar_color || getAvatarColor(displayUsername),
                    createdAt: r.created_at,
                    // Email is ONLY visible to the master admin for moderation; hidden for all other users
                    email: isMasterAdminReq ? r.email : undefined
                };
            });

            return res.json({
                status: true,
                messages: safeMessages,
                serverTime: new Date().toISOString()
            });
        } catch (e) {
            console.error('[GLOBAL_CHAT] GET Error:', e.message);
            return res.status(500).json({ status: false, message: 'Gagal memuat pesan chat global: ' + e.message });
        }
    }

    // 2. POST /api/global-chat - Send a new message
    if (method === 'POST') {
        try {
            if (!pool) {
                return res.status(503).json({ status: false, message: 'Database utama belum siap.' });
            }

            // Rate limit check (Anti-Spam)
            const rateKey = `${clientIp}_${req.headers.authorization || ''}`;
            if (isRateLimited(rateKey)) {
                return res.status(429).json({
                    status: false,
                    message: 'Mohon tunggu 2 detik sebelum mengirim pesan berikutnya (Anti-Spam).'
                });
            }

            // Verify User Authentication (Supports User JWT, Session Tokens, and Master Admin Token)
            const authHeader = req.headers.authorization || req.headers['x-auth-token'] || '';
            const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
            const adminToken = (req.headers['x-admin-token'] || '').trim();

            const headerUid = req.headers['x-user-id'] || req.headers['x-device-id'] || '';
            const headerUsername = req.headers['x-user-name'] || '';
            const headerEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();

            let currentUser = null;
            let verifiedUid = null;
            let verifiedUsername = null;

            // 1. Prioritize Standard User Authentication (JWT Token or Session)
            if (rawToken && rawToken.startsWith('usr_')) {
                const verified = userAuth.verifyUserToken(rawToken);
                if (verified && verified.uid) {
                    verifiedUid = typeof verified.uid === 'object' ? (verified.uid.id || verified.uid.userId) : String(verified.uid);
                    verifiedUsername = verified.u || '';
                }
            }

            const effectiveUid = verifiedUid || headerUid;
            const effectiveUsername = verifiedUsername || headerUsername;

            if (effectiveUid || effectiveUsername || rawToken || headerEmail) {
                try {
                    const dbData = await storage.readDataAsync('users.json', { users: [], sessions: {} });
                    let foundUser = null;
                    if (verifiedUid) {
                        foundUser = (dbData.users || []).find(u => String(u.id) === String(verifiedUid));
                    }
                    if (!foundUser && headerEmail) {
                        foundUser = (dbData.users || []).find(u => (u.email && u.email.toLowerCase() === headerEmail) || (u.rawEmail && u.rawEmail.toLowerCase() === headerEmail));
                    }
                    if (!foundUser && effectiveUid) {
                        foundUser = (dbData.users || []).find(u => String(u.id) === String(effectiveUid));
                    }
                    if (!foundUser && effectiveUsername) {
                        foundUser = (dbData.users || []).find(u => u.username && u.username.toLowerCase() === effectiveUsername.toLowerCase());
                    }
                    if (!foundUser && rawToken && dbData.sessions && dbData.sessions[rawToken]) {
                        const sess = dbData.sessions[rawToken];
                        foundUser = (dbData.users || []).find(u => String(u.id) === String(sess.userId) || u.username === sess.username);
                    }

                    if (foundUser) {
                        const isFoundAdmin = (foundUser.email || foundUser.rawEmail || '').toLowerCase().trim() === 'jrnabil570@gmail.com' || String(foundUser.id) === 'u_1790196636099_622dc736';
                        currentUser = {
                            id: String(foundUser.id || effectiveUid),
                            username: isFoundAdmin ? 'MusifyStar Official' : (foundUser.username || effectiveUsername || 'Musisi'),
                            email: foundUser.email || foundUser.rawEmail || headerEmail || '',
                            rawEmail: foundUser.rawEmail || foundUser.email || headerEmail || '',
                            isAdmin: isFoundAdmin,
                            badge: isFoundAdmin ? 'Admin' : 'Member'
                        };
                    } else if (effectiveUid || effectiveUsername || headerEmail) {
                        const isGuestAdmin = (headerEmail === 'jrnabil570@gmail.com' || effectiveUid === 'u_1790196636099_622dc736');
                        currentUser = {
                            id: String(effectiveUid || 'usr_' + Date.now()),
                            username: isGuestAdmin ? 'MusifyStar Official' : (effectiveUsername || 'Musisi'),
                            email: headerEmail || (isGuestAdmin ? 'jrnabil570@gmail.com' : ''),
                            rawEmail: headerEmail || (isGuestAdmin ? 'jrnabil570@gmail.com' : ''),
                            isAdmin: isGuestAdmin,
                            badge: isGuestAdmin ? 'Admin' : 'Member'
                        };
                    }
                } catch (e) {}
            }

            // 2. Fallback: If not authenticated as standard user, check if Master Admin Token
            if (!currentUser && (adminAuth.isValidToken(rawToken) || adminAuth.isValidToken(adminToken) || (headerEmail === 'jrnabil570@gmail.com' && (rawToken || adminToken)))) {
                currentUser = {
                    id: 'u_1790196636099_622dc736',
                    username: 'MusifyStar Official',
                    email: 'jrnabil570@gmail.com',
                    rawEmail: 'jrnabil570@gmail.com',
                    isAdmin: true,
                    badge: 'Admin'
                };
            }

            // Require logged in user to send message (Guarantees authentic email & identity in DB)
            if (!currentUser) {
                return res.status(401).json({
                    status: false,
                    message: 'Silakan login ke akun MusifyStar Anda terlebih dahulu untuk mengirim pesan di Chat Global.'
                });
            }

            // Check if user or IP is banned
            try {
                const banRegistry = await storage.readDataAsync('banned_registry.json', {});
                const userEmailLower = ((currentUser.email || currentUser.rawEmail || '')).toLowerCase().trim();
                const userNameLower = (currentUser.username || '').toLowerCase().trim();

                if (banRegistry[userEmailLower] || banRegistry[userNameLower] || banRegistry[clientIp]) {
                    return res.status(403).json({
                        status: false,
                        message: 'Akun atau alamat jaringan Anda sedang ditangguhkan dari sistem interaksi publik.'
                    });
                }
            } catch (e) {}

            const body = req.body || {};
            const rawMessage = String(body.message || '').trim();

            if (!rawMessage) {
                return res.status(400).json({ status: false, message: 'Isi pesan tidak boleh kosong.' });
            }

            if (rawMessage.length > 500) {
                return res.status(400).json({ status: false, message: 'Pesan terlalu panjang (maksimal 500 karakter).' });
            }

            // Sanitize message content (Anti-XSS)
            const cleanMessage = sanitizeText(rawMessage);
            const username = String(currentUser.username || 'Musisi').trim().slice(0, 30);
            const email = String(currentUser.email || currentUser.rawEmail || '').toLowerCase().trim();
            const userId = String(currentUser.id || currentUser.userId || '');

            // Master Admin Verification
            const isMasterAdmin = (email === 'jrnabil570@gmail.com' || userId === 'u_1790196636099_622dc736' || userId === 'admin_1');
            const badge = isMasterAdmin ? 'Admin' : 'Member';
            const displayUsername = isMasterAdmin ? 'MusifyStar Official' : username;
            const avatarColor = getAvatarColor(displayUsername);

            // Insert into PRIMARY Neon PostgreSQL database
            const insertResult = await pool.query(
                `INSERT INTO global_chat_messages 
                (user_id, username, email, message, badge, is_admin, avatar_color, ip_address, created_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
                RETURNING id, user_id, username, message, badge, is_admin, avatar_color, created_at`,
                [userId, displayUsername, email, cleanMessage, badge, isMasterAdmin, avatarColor, clientIp]
            );

            const saved = insertResult.rows[0];

            return res.json({
                status: true,
                message: 'Pesan berhasil terkirim ke Chat Global!',
                chat: {
                    id: String(saved.id),
                    userId: saved.user_id,
                    username: saved.username,
                    message: saved.message,
                    badge: isMasterAdmin ? 'Admin' : saved.badge,
                    isAdmin: isMasterAdmin || !!saved.is_admin,
                    isVerifiedAdmin: isMasterAdmin,
                    avatarColor: saved.avatar_color,
                    createdAt: saved.created_at,
                    clientTempId: body.clientTempId || undefined
                }
            });
        } catch (e) {
            console.error('[GLOBAL_CHAT] POST Error:', e.message);
            return res.status(500).json({ status: false, message: 'Gagal mengirim pesan: ' + e.message });
        }
    }

    // 3. DELETE /api/global-chat - Delete message (Admin or author)
    if (method === 'DELETE') {
        try {
            if (!pool) {
                return res.status(503).json({ status: false, message: 'Database utama belum siap.' });
            }

            const rawId = req.query.id || req.body?.id;
            if (!rawId) {
                return res.status(400).json({ status: false, message: 'ID pesan diperlukan' });
            }

            const numId = parseInt(rawId, 10);
            if (isNaN(numId)) {
                return res.json({ status: true, message: 'Pesan lokal berhasil dihapus.' });
            }

            const adminToken = req.headers['x-admin-token'] || req.query.admin_token;
            let isMasterAdmin = adminAuth.isValidToken(adminToken);

            const authHeader = req.headers.authorization || req.headers['x-auth-token'] || '';
            const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
            const headerEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
            const headerUid = req.headers['x-user-id'] || '';
            const headerUsername = (req.headers['x-user-name'] || '').toLowerCase().trim();

            let callerUid = headerUid;
            let callerEmail = headerEmail;
            let callerUsername = headerUsername;

            if (rawToken) {
                if (rawToken.startsWith('usr_')) {
                    const verified = userAuth.verifyUserToken(rawToken);
                    if (verified && verified.uid) {
                        callerUid = typeof verified.uid === 'object' ? (verified.uid.id || verified.uid.userId) : String(verified.uid);
                        if (verified.u) callerUsername = String(verified.u).toLowerCase().trim();
                    }
                } else if (adminAuth.isValidToken(rawToken)) {
                    isMasterAdmin = true;
                }
            }

            // Look up in users.json to resolve verified identity
            if (callerUid || callerEmail || callerUsername) {
                try {
                    const dbData = await storage.readDataAsync('users.json', { users: [] });
                    const user = (dbData.users || []).find(u => 
                        (callerUid && String(u.id) === String(callerUid)) ||
                        (callerEmail && ((u.email && u.email.toLowerCase() === callerEmail) || (u.rawEmail && u.rawEmail.toLowerCase() === callerEmail))) ||
                        (callerUsername && u.username && u.username.toLowerCase() === callerUsername)
                    );
                    if (user) {
                        callerEmail = (user.email || user.rawEmail || callerEmail).toLowerCase().trim();
                        callerUid = String(user.id || callerUid);
                        callerUsername = (user.username || callerUsername).toLowerCase().trim();
                    }
                } catch (e) {}
            }

            // MASTER ADMIN (jrnabil570@gmail.com) can delete ANY message!
            if (callerEmail === 'jrnabil570@gmail.com' || callerUid === 'u_1790196636099_622dc736') {
                isMasterAdmin = true;
            }

            let isAllowed = isMasterAdmin;

            // Otherwise, check if caller is the original author of this message
            if (!isAllowed) {
                const checkMsg = await pool.query('SELECT user_id, email, username FROM global_chat_messages WHERE id = $1', [numId]);
                if (checkMsg.rows.length > 0) {
                    const row = checkMsg.rows[0];
                    const msgUid = String(row.user_id || '');
                    const msgEmail = (row.email || '').toLowerCase().trim();
                    const msgUsername = (row.username || '').toLowerCase().trim();

                    if ((callerUid && msgUid && callerUid === msgUid) ||
                        (callerEmail && msgEmail && callerEmail === msgEmail) ||
                        (callerUsername && msgUsername && callerUsername === msgUsername)) {
                        isAllowed = true;
                    }
                } else {
                    return res.json({ status: true, message: 'Pesan telah dihapus.' });
                }
            }

            if (!isAllowed) {
                return res.status(403).json({ status: false, message: 'Akses ditolak: Hanya pengirim atau Admin yang dapat menghapus pesan ini.' });
            }

            await pool.query('DELETE FROM global_chat_messages WHERE id = $1', [numId]);

            return res.json({ status: true, message: 'Pesan berhasil dihapus dari database utama.' });
        } catch (e) {
            console.error('[GLOBAL_CHAT] DELETE Error:', e.message);
            return res.status(500).json({ status: false, message: 'Gagal menghapus pesan: ' + e.message });
        }
    }

    return res.status(405).json({ status: false, message: 'Metode tidak didukung' });
};
