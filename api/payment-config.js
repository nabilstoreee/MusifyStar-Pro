const fs = require('fs');
const path = require('path');
const adminAuth = require('./admin-auth.js');
const storage = require('./storage.js');

const PAYMENT_CONFIG_FILE = '.payment_config.json';

const DEFAULT_PAYMENT_CONFIG = {
    qrisUrl: '/qris.png',
    qrisFilename: 'QRIS-MusifyStar-Nabil.png',
    accounts: [
        {
            id: 'acc_seabank',
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            badge: '',
            icon: 'credit-card'
        },
        {
            id: 'acc_dana',
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            badge: '',
            icon: 'smartphone'
        }
    ],
    title: 'Dukung Pengembang MusifyStar',
    description: 'Donasi sukarela Anda sangat berharga untuk biaya sewa server & pengembangan fitur MusifyStar.',
    note: 'Semua dana donasi digunakan untuk perawatan server & penambahan fitur baru agar aplikasi tetap gratis tanpa iklan.',
    updatedAt: new Date().toISOString()
};

async function getPaymentConfig() {
    try {
        const data = await storage.readDataAsync(PAYMENT_CONFIG_FILE, DEFAULT_PAYMENT_CONFIG);
        if (data && typeof data === 'object') {
            return {
                qrisUrl: data.qrisUrl || '/qris.png',
                qrisFilename: data.qrisFilename || 'QRIS-MusifyStar-Nabil.png',
                accounts: Array.isArray(data.accounts) && data.accounts.length ? data.accounts : DEFAULT_PAYMENT_CONFIG.accounts,
                title: data.title || DEFAULT_PAYMENT_CONFIG.title,
                description: data.description || DEFAULT_PAYMENT_CONFIG.description,
                note: data.note || DEFAULT_PAYMENT_CONFIG.note,
                updatedAt: data.updatedAt || new Date().toISOString()
            };
        }
    } catch (e) {
        console.error('[PAYMENT_CONFIG] Error reading config:', e.message);
    }
    return DEFAULT_PAYMENT_CONFIG;
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
        const config = await getPaymentConfig();
        return res.json({ status: true, config });
    }

    if (req.method === 'POST') {
        const token = req.headers['x-admin-token'] || req.query.token;
        if (!token || !adminAuth.isValidToken(token)) {
            return res.status(401).json({
                status: false,
                message: 'Akses ditolak: Token admin tidak valid atau kedaluwarsa'
            });
        }

        const body = req.body || {};
        const currentConfig = await getPaymentConfig();

        let updatedQrisUrl = currentConfig.qrisUrl;

        // Reset to default QRIS if requested
        if (body.resetDefault) {
            const customPath = path.join(__dirname, '..', 'public', 'qris_custom.png');
            try {
                if (fs.existsSync(customPath)) fs.unlinkSync(customPath);
            } catch (e) {}
            updatedQrisUrl = '/qris.png';
        } else if (body.qrisBase64 && typeof body.qrisBase64 === 'string') {
            try {
                const matches = body.qrisBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(body.qrisBase64, 'base64');
                const targetPath = path.join(__dirname, '..', 'public', 'qris_custom.png');
                fs.writeFileSync(targetPath, buffer);
                updatedQrisUrl = `/qris_custom.png?v=${Date.now()}`;
            } catch (err) {
                console.error('[PAYMENT_CONFIG] Failed to save custom QRIS image:', err.message);
            }
        } else if (body.qrisUrl && typeof body.qrisUrl === 'string') {
            updatedQrisUrl = body.qrisUrl.trim();
        }

        const updatedConfig = {
            qrisUrl: updatedQrisUrl,
            qrisFilename: (body.qrisFilename && typeof body.qrisFilename === 'string') ? body.qrisFilename.trim() : currentConfig.qrisFilename,
            accounts: Array.isArray(body.accounts) ? body.accounts.map((acc, idx) => ({
                id: acc.id || `acc_${Date.now()}_${idx}`,
                bankName: String(acc.bankName || 'Bank').trim(),
                accountNumber: String(acc.accountNumber || '').trim(),
                accountHolder: String(acc.accountHolder || '').trim(),
                badge: String(acc.badge || 'Transfer').trim(),
                icon: String(acc.icon || 'credit-card').trim()
            })) : currentConfig.accounts,
            title: (body.title && typeof body.title === 'string') ? body.title.trim() : currentConfig.title,
            description: (body.description && typeof body.description === 'string') ? body.description.trim() : currentConfig.description,
            note: (body.note && typeof body.note === 'string') ? body.note.trim() : currentConfig.note,
            updatedAt: new Date().toISOString()
        };

        await storage.writeDataAsync(PAYMENT_CONFIG_FILE, updatedConfig);

        return res.json({
            status: true,
            message: 'Konfigurasi QRIS & Rekening Donasi berhasil diperbarui!',
            config: updatedConfig
        });
    }

    return res.status(405).json({ status: false, message: 'Method not allowed' });
};
