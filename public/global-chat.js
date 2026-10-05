// ==========================================
// MUSIFYSTAR GLOBAL CHAT SYSTEM
// MusifyStar Cyber-Dark & Neon Cyan Music Aesthetic
// Integrated with Neon PostgreSQL Primary Database
// Strict Anti-DevTools & Anti-Tampering Security
// ==========================================

(function() {
    'use strict';

    // Anti-DevTools Console Warning Banner
    try {
        console.log(
            '%c[MUSIFYSTAR SECURITY PROTOCOL]%c\nSistem Chat Global terlindungi oleh enkripsi server & verifikasi PostgreSQL primer.\nPeringatan: Dilarang keras manipulasi token, penyalahgunaan console, atau inspeksi injeksi skrip (Self-XSS).',
            'background: #0f172a; color: #38bdf8; font-size: 14px; font-weight: bold; padding: 6px 10px; border-radius: 6px; border: 1px solid #0284c7;',
            'color: #f59e0b; font-size: 11px; font-weight: normal; margin-top: 4px;'
        );
    } catch (e) {}

    // Clean up any stale legacy device cache
    try { localStorage.removeItem('musifystar_sent_chat_ids'); } catch (e) {}

    var GlobalChat = {
        isOpen: false,
        pollInterval: null,
        lastMessageCount: 0,
        messages: [],
        isSending: false,

        // Verified Blue Checkmark + Admin Badge (Exclusively for jrnabil570@gmail.com)
        // Format: Admin first, blue checkmark right beside it on the right (Admin ✅)
        getAdminBlueCheckmarkHTML() {
            var checkmarkSvg = `
            <svg style="width: 12px; height: 12px;" class="shrink-0 inline-block align-middle ml-1" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#0095F6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L10 13.586l5.293-5.293a1 1 0 0 1 1.414 0z" fill="#FFFFFF"/>
            </svg>`;

            return `
            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-slate-200 text-[10px] font-semibold tracking-wide shadow-sm select-none" title="Admin Terverifikasi Resmi">
                <span>Admin</span>
                ${checkmarkSvg}
            </span>`;
        },

        // Helper: Resolve Current User Identity
        getCurrentUser() {
            var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
            if (!u) {
                try {
                    var raw = localStorage.getItem('musifystar_auth_user') || sessionStorage.getItem('musifystar_auth_user');
                    if (raw) u = JSON.parse(raw);
                } catch (e) {}
            }

            // Only mark as Master Admin if user email is strictly jrnabil570@gmail.com
            if (u) {
                var email = (u.email || u.rawEmail || '').toLowerCase().trim();
                var uid = String(u.id || u.userId || '');
                if (email === 'jrnabil570@gmail.com' || uid === 'u_1790196636099_622dc736') {
                    u.isAdmin = true;
                    u.isVerifiedAdmin = true;
                    u.badge = 'Admin';
                    u.username = 'MusifyStar Official';
                    if (!u.email) u.email = 'jrnabil570@gmail.com';
                } else {
                    u.isAdmin = false;
                    u.isVerifiedAdmin = false;
                    u.badge = 'Member';
                }
            }

            return u;
        },

        // Open Global Chat Modal (Requires Active Login)
        open() {
            var u = GlobalChat.getCurrentUser();
            if (!u) {
                if (typeof showToast === 'function') {
                    showToast('Silakan login terlebih dahulu untuk mengakses Chat Global.');
                }
                if (typeof Auth !== 'undefined' && typeof Auth.openModal === 'function') {
                    Auth.openModal();
                }
                return;
            }

            var existing = document.getElementById('musifystar-global-chat-modal');
            if (existing) existing.remove();

            GlobalChat.isOpen = true;

            var modal = document.createElement('div');
            modal.id = 'musifystar-global-chat-modal';
            modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none';

            // Anti-DevTools & Anti-Inspection Protections on Chat Interface
            modal.oncontextmenu = function(e) {
                e.preventDefault();
                return false;
            };

            var handleKeyDown = function(e) {
                // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
                if (
                    e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
                    (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                if (e.key === 'Escape' && GlobalChat.isOpen) {
                    GlobalChat.close();
                }
            };
            modal.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keydown', handleKeyDown);
            modal._cleanupKeyDown = handleKeyDown;

            var isMasterAdmin = (u.email || u.rawEmail || '').toLowerCase().trim() === 'jrnabil570@gmail.com';

            modal.innerHTML = `
            <div class="relative w-full max-w-xl h-[92vh] sm:h-[86vh] max-h-[760px] bg-[#0f1217] border border-slate-800/80 rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
                <!-- Chat Header (Sleek Dark Obsidian Theme) -->
                <div class="relative z-10 px-4 sm:px-6 py-3.5 bg-[#141720] border-b border-slate-800/80 flex items-center justify-between shrink-0 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-inner shrink-0">
                            <i data-lucide="message-square" class="w-5 h-5 text-slate-300"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="text-sm sm:text-base font-bold text-slate-100 tracking-tight">Chat Global MusifyStar</h2>
                                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[9px] font-semibold">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>LIVE</span>
                                </span>
                            </div>
                            <p class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <i data-lucide="shield-check" class="w-3 h-3 text-slate-400"></i>
                                <span>Ruang Obrolan Komunitas Musik &bull; Terenkripsi</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button onclick="GlobalChat.fetchMessages(false)" class="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer" title="Segarkan Chat">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        </button>
                        <button onclick="GlobalChat.close()" class="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 hover:border-rose-500/40 border border-slate-700/50 active:scale-95 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-all cursor-pointer" title="Tutup Chat">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages Stream (Deep Dark Background, Eye-Friendly) -->
                <div id="global-chat-stream" class="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 hide-scrollbar bg-[#0c0e14]">
                    <div id="global-chat-loading" class="text-center py-20 text-slate-500 space-y-2">
                        <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto text-slate-400"></i>
                        <p class="text-xs font-medium">Memuat pesan obrolan...</p>
                    </div>
                </div>

                <!-- Chat Input Bottom Bar -->
                <div id="global-chat-bottom-bar" class="relative z-10 px-3.5 sm:px-5 py-3 bg-[#141720] border-t border-slate-800/80 shrink-0">
                    ${GlobalChat.renderBottomBar(u, isMasterAdmin)}
                </div>
            </div>`;

            // Click outside backdrop closes modal
            modal.onclick = function(e) {
                if (e.target === modal) {
                    GlobalChat.close();
                }
            };

            document.body.appendChild(modal);
            if (window.lucide) lucide.createIcons();

            // Fetch initial messages immediately
            GlobalChat.fetchMessages(false);

            // Start auto-poll every 2.5 seconds while open
            if (GlobalChat.pollInterval) clearInterval(GlobalChat.pollInterval);
            GlobalChat.pollInterval = setInterval(function() {
                if (GlobalChat.isOpen && document.getElementById('musifystar-global-chat-modal')) {
                    GlobalChat.fetchMessages(true);
                } else {
                    GlobalChat.close();
                }
            }, 2500);

            // Hide unread badge on header
            var badge = document.getElementById('global-chat-badge');
            if (badge) badge.classList.add('hidden');
        },

        // Close Global Chat Modal
        close() {
            GlobalChat.isOpen = false;
            if (GlobalChat.pollInterval) {
                clearInterval(GlobalChat.pollInterval);
                GlobalChat.pollInterval = null;
            }
            var modal = document.getElementById('musifystar-global-chat-modal');
            if (modal) {
                if (modal._cleanupKeyDown) {
                    window.removeEventListener('keydown', modal._cleanupKeyDown);
                }
                modal.remove();
            }
        },

        // Render Bottom Bar
        renderBottomBar(user, isMasterAdmin) {
            var username = isMasterAdmin ? 'MusifyStar Official' : (user ? (user.username || 'Musisi') : 'Musisi');

            var senderBadgeHTML = isMasterAdmin 
                ? GlobalChat.getAdminBlueCheckmarkHTML() 
                : `<span class="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 ml-1">Member</span>`;

            return `
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px] text-slate-400 px-1 select-none">
                    <span class="flex items-center gap-1.5 truncate">
                        <span class="text-slate-400">Mengirim sebagai:</span>
                        <b class="text-slate-200 font-semibold truncate">${GlobalChat.escapeHtml(username)}</b>
                        ${senderBadgeHTML}
                    </span>
                    <span id="global-chat-char-count" class="font-mono text-[10px] text-slate-500">0/500</span>
                </div>
                <form onsubmit="event.preventDefault(); GlobalChat.sendMessage();" class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <input 
                            type="text" 
                            id="global-chat-input" 
                            maxlength="500" 
                            autocomplete="off"
                            placeholder="Kirim Pesan keKomunitas MusifyStar..." 
                            oninput="GlobalChat.updateCharCount(this)"
                            class="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#1a1f29] border border-slate-700/80 focus:border-slate-500 text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-slate-500/20 transition-all shadow-inner"
                        />
                    </div>
                    <button 
                        type="submit" 
                        id="global-chat-send-btn" 
                        class="w-11 h-11 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        title="Kirim pesan"
                    >
                        <i data-lucide="send" class="w-4 h-4 text-white"></i>
                    </button>
                </form>
            </div>`;
        },

        updateCharCount(el) {
            var counter = document.getElementById('global-chat-char-count');
            if (counter && el) {
                var len = el.value.length;
                counter.innerText = len + '/500';
                if (len >= 480) {
                    counter.className = 'font-mono text-[10px] text-rose-400 font-bold';
                } else {
                    counter.className = 'font-mono text-[10px] text-white/40';
                }
            }
        },

        // Fetch Messages from Primary Neon PostgreSQL Database
        async fetchMessages(isBackground) {
            try {
                var headers = {};
                var u = GlobalChat.getCurrentUser();
                var isMasterAdmin = u && ((u.email || u.rawEmail || '').toLowerCase().trim() === 'jrnabil570@gmail.com');
                
                if (isMasterAdmin) {
                    var adminToken = (typeof Profile !== 'undefined' && typeof Profile.getAdminToken === 'function') 
                        ? Profile.getAdminToken() 
                        : (sessionStorage.getItem('musifystar_admin_token') || localStorage.getItem('musifystar_admin_token') || '');
                    if (adminToken) headers['x-admin-token'] = adminToken;
                }

                var userToken = (typeof Auth !== 'undefined' && Auth.token) ? Auth.token : (localStorage.getItem('musifystar_auth_token') || '');
                if (userToken) {
                    headers['Authorization'] = 'Bearer ' + userToken;
                }

                var res = await fetch('/api/global-chat?t=' + Date.now(), {
                    headers: headers,
                    cache: 'no-store'
                });
                var data = await res.json();

                if (data && data.status && Array.isArray(data.messages)) {
                    var isNewMessage = data.messages.length > GlobalChat.lastMessageCount;
                    GlobalChat.messages = data.messages;
                    GlobalChat.lastMessageCount = data.messages.length;

                    GlobalChat.renderMessagesList(data.messages, isBackground ? isNewMessage : true);
                }
            } catch (e) {
                if (!isBackground) {
                    var stream = document.getElementById('global-chat-stream');
                    if (stream) {
                        stream.innerHTML = `
                        <div class="text-center py-20 text-rose-400 space-y-2">
                            <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                            <p class="text-xs font-semibold">Gagal memuat pesan: ${GlobalChat.escapeHtml(e.message)}</p>
                            <button onclick="GlobalChat.fetchMessages(false)" class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">Coba Lagi</button>
                        </div>`;
                        if (window.lucide) lucide.createIcons();
                    }
                }
            }
        },

        // Render Messages in Stream (Strict Per-User Ownership)
        renderMessagesList(msgs, shouldScroll) {
            var stream = document.getElementById('global-chat-stream');
            if (!stream) return;

            if (msgs.length === 0) {
                stream.innerHTML = `
                <div class="text-center py-24 text-white/40 space-y-3">
                    <div class="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                        <i data-lucide="message-square" class="w-7 h-7"></i>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">Belum Ada Pesan</p>
                        <p class="text-xs text-white/50">Jadilah yang pertama menyapa komunitas musik MusifyStar!</p>
                    </div>
                </div>`;
                if (window.lucide) lucide.createIcons();
                return;
            }

            var u = GlobalChat.getCurrentUser();
            if (!u) return;

            var myId = String(u.id || u.userId || '');
            var myName = String(u.username || '').toLowerCase().trim();
            var myEmail = String(u.email || u.rawEmail || '').toLowerCase().trim();
            var isMasterAdmin = (myEmail === 'jrnabil570@gmail.com');

            var dateDivider = `
            <div class="flex justify-center my-3 select-none">
                <span class="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/40 text-[10px] text-slate-400 font-sans tracking-wide">
                    Ruang Chat Global MusifyStar
                </span>
            </div>`;

            var messagesHtml = msgs.map(function(m) {
                var msgUserId = String(m.userId || '');
                var msgUsername = String(m.username || '').toLowerCase().trim();
                var msgEmail = String(m.email || '').toLowerCase().trim();

                // STRICT ACCOUNT OWNERSHIP:
                // A message is 'isMe' IF AND ONLY IF it was created by the currently logged-in account
                var isMe = false;
                if (myId && msgUserId && msgUserId === myId) {
                    isMe = true;
                } else if (isMasterAdmin && (msgUserId === 'u_1790196636099_622dc736' || msgUserId === 'admin_1' || msgEmail === 'jrnabil570@gmail.com')) {
                    isMe = true;
                } else if (myEmail && msgEmail && msgEmail === myEmail) {
                    isMe = true;
                } else if (myName && msgUsername && msgUsername === myName) {
                    isMe = true;
                } else if (m.clientTempId && m.optimisticAuthorId === myId) {
                    isMe = true;
                }

                // Admin Centang Biru Detection:
                // Strictly true if email is jrnabil570@gmail.com, or user_id is u_1790196636099_622dc736, or flagged as verified admin
                var isMsgAdmin = !!m.isVerifiedAdmin || !!m.isAdmin || (msgEmail === 'jrnabil570@gmail.com') || (msgUserId === 'u_1790196636099_622dc736') || (msgUserId === 'admin_1') || (m.badge === 'Admin' && (m.username === 'nabil' || m.username === 'MusifyStar Official' || msgUserId === 'u_1790196636099_622dc736'));
                var displayUsername = isMsgAdmin ? 'MusifyStar Official' : (m.username || 'Musisi');
                var avatarColor = isMsgAdmin ? 'from-slate-700 to-slate-900 border border-slate-600/60' : (m.avatarColor || 'from-slate-700 to-slate-800');
                var initial = isMsgAdmin ? 'M' : (displayUsername.charAt(0).toUpperCase());
                var timeStr = GlobalChat.formatTime(m.createdAt);

                // Admin Centang Biru Badge: Admin ✅
                var badgeHtml = isMsgAdmin ? GlobalChat.getAdminBlueCheckmarkHTML() : '';

                // Delete option: Master Admin can delete ANY message, or user can delete their own message
                var deleteBtn = (isMasterAdmin || isMe) ? `
                <button type="button" onclick="GlobalChat.deleteMessage(event, '${m.id}')" class="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 active:scale-90 transition-all cursor-pointer inline-flex items-center justify-center shrink-0" title="Hapus pesan ini">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>` : '';

                // ==========================================
                // 1. PESAN SAYA (AKUN INI SENDIRI: DI KANAN)
                // ==========================================
                if (isMe) {
                    var statusSending = m.isSending ? `
                        <span class="inline-flex text-slate-400" title="Mengirim...">
                            <i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i>
                        </span>
                    ` : '';

                    return `
                    <div class="flex justify-end items-end w-full group my-2 pl-8 sm:pl-16">
                        <!-- Dark Obsidian Outgoing Bubble (Comfortable, eye-friendly, no bright colors) -->
                        <div class="relative max-w-[85%] sm:max-w-[75%] bg-[#222834] border border-slate-700/70 text-slate-100 rounded-2xl px-4 py-2.5 shadow-md shadow-black/40">
                            <!-- Optional Admin Centang Biru Header if sender is Admin -->
                            ${isMsgAdmin ? `
                            <div class="flex items-center justify-end gap-1.5 mb-1.5 select-none flex-wrap">
                                <span class="text-xs font-semibold text-slate-200 tracking-tight">${GlobalChat.escapeHtml(displayUsername)}</span>
                                ${badgeHtml}
                            </div>
                            ` : ''}

                            <!-- Message text -->
                            <p class="text-[13px] sm:text-[14px] leading-relaxed select-text break-words whitespace-pre-wrap font-sans text-slate-100 font-normal">${GlobalChat.escapeHtml(m.message)}</p>
                            
                            <!-- Meta Time & Delete Action -->
                            <div class="flex items-center justify-end gap-2 mt-1 select-none">
                                ${deleteBtn}
                                <span class="text-[10px] text-slate-400 font-mono">${timeStr}</span>
                                ${statusSending}
                            </div>
                        </div>
                    </div>`;
                }

                // ==========================================
                // 2. PESAN ORANG LAIN (AKUN LAIN: DI KIRI DENGAN AVATAR & NAMA)
                // ==========================================
                return `
                <div class="flex justify-start items-start gap-2.5 w-full group my-2 pr-8 sm:pr-16">
                    <!-- Avatar Pengirim -->
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-black/40 mt-0.5 select-none ring-1 ring-white/10">
                        ${initial}
                    </div>

                    <!-- Dark Obsidian Incoming Bubble -->
                    <div class="relative max-w-[85%] sm:max-w-[75%] bg-[#161a22] border border-slate-800 text-slate-200 rounded-2xl px-4 py-2.5 shadow-md shadow-black/40">
                        <!-- Header Nama Pengirim & Admin Centang Biru -->
                        <div class="flex items-center gap-1.5 mb-1.5 select-none flex-wrap">
                            <span class="text-xs font-semibold text-slate-200 tracking-tight">${GlobalChat.escapeHtml(displayUsername)}</span>
                            ${badgeHtml}
                        </div>

                        <!-- Isi Pesan -->
                        <p class="text-[13px] sm:text-[14px] leading-relaxed select-text break-words whitespace-pre-wrap font-sans text-slate-200 font-normal">${GlobalChat.escapeHtml(m.message)}</p>

                        <!-- Meta Waktu & Delete Button -->
                        <div class="flex items-center justify-end gap-2 mt-1 select-none">
                            ${deleteBtn}
                            <span class="text-[10px] text-slate-500 font-mono">${timeStr}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');

            stream.innerHTML = dateDivider + messagesHtml;
            if (window.lucide) lucide.createIcons();

            if (shouldScroll) {
                GlobalChat.scrollToBottom();
            }
        },

        scrollToBottom() {
            var stream = document.getElementById('global-chat-stream');
            if (stream) {
                setTimeout(function() {
                    stream.scrollTop = stream.scrollHeight;
                }, 50);
            }
        },

        // Send Message
        async sendMessage() {
            var input = document.getElementById('global-chat-input');
            if (!input) return;

            var text = input.value.trim();
            if (!text) return;

            var u = GlobalChat.getCurrentUser();
            var token = (typeof Auth !== 'undefined' && Auth.token) ? Auth.token : (localStorage.getItem('musifystar_auth_token') || '');

            if (!u || !token) {
                if (typeof showToast === 'function') {
                    showToast('Silakan login terlebih dahulu untuk mengirim pesan.');
                }
                GlobalChat.close();
                if (typeof Auth !== 'undefined') Auth.openModal();
                return;
            }

            var btn = document.getElementById('global-chat-send-btn');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-white"></i>';
                if (window.lucide) lucide.createIcons();
            }

            var myId = String(u.id || u.userId || '');
            var myEmail = (u.email || u.rawEmail || '').toLowerCase().trim();
            var isMasterAdmin = (myEmail === 'jrnabil570@gmail.com' || myId === 'u_1790196636099_622dc736');
            var myUsername = isMasterAdmin ? 'MusifyStar Official' : (u.username || 'Musisi');

            // Only pass admin token if user is actually Master Admin
            var adminToken = '';
            if (isMasterAdmin) {
                adminToken = (typeof Profile !== 'undefined' && typeof Profile.getAdminToken === 'function') 
                    ? Profile.getAdminToken() 
                    : (sessionStorage.getItem('musifystar_admin_token') || localStorage.getItem('musifystar_admin_token') || '');
            }

            // OPTIMISTIC UPDATE: Message immediately appears on the RIGHT with sending status
            var tempId = 'temp_' + Date.now();
            var optimisticMessage = {
                id: tempId,
                clientTempId: tempId,
                optimisticAuthorId: myId,
                userId: myId,
                username: myUsername,
                message: text,
                badge: isMasterAdmin ? 'Admin' : 'Member',
                isAdmin: isMasterAdmin,
                isVerifiedAdmin: isMasterAdmin,
                avatarColor: isMasterAdmin ? 'from-slate-700 to-slate-900 border border-slate-600/60' : 'from-slate-700 to-slate-800',
                createdAt: new Date().toISOString(),
                isSending: true
            };

            GlobalChat.messages.push(optimisticMessage);
            input.value = '';
            GlobalChat.updateCharCount(input);
            GlobalChat.renderMessagesList(GlobalChat.messages, true);

            try {
                var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-Auth-Token': token,
                    'X-User-Id': myId,
                    'X-User-Name': myUsername,
                    'X-User-Email': myEmail
                };
                if (adminToken) {
                    headers['X-Admin-Token'] = adminToken;
                }

                var res = await fetch('/api/global-chat', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        message: text,
                        clientTempId: tempId
                    })
                });

                var data = await res.json();
                if (data && data.status && data.chat) {
                    // Replace optimistic message with confirmed database record
                    var idx = GlobalChat.messages.findIndex(function(m) {
                        return m.clientTempId === tempId || String(m.id) === String(tempId);
                    });
                    if (idx !== -1) {
                        GlobalChat.messages[idx] = data.chat;
                    } else {
                        GlobalChat.messages.push(data.chat);
                    }
                    GlobalChat.renderMessagesList(GlobalChat.messages, true);
                    GlobalChat.fetchMessages(true);
                } else {
                    // Revert optimistic message if server failed
                    GlobalChat.messages = GlobalChat.messages.filter(function(m) { return m.clientTempId !== tempId; });
                    GlobalChat.renderMessagesList(GlobalChat.messages, false);
                    input.value = text;
                    GlobalChat.updateCharCount(input);
                    if (typeof showToast === 'function') {
                        showToast(data.message || 'Gagal mengirim pesan');
                    }
                }
            } catch (e) {
                GlobalChat.messages = GlobalChat.messages.filter(function(m) { return m.clientTempId !== tempId; });
                GlobalChat.renderMessagesList(GlobalChat.messages, false);
                input.value = text;
                GlobalChat.updateCharCount(input);
                if (typeof showToast === 'function') {
                    showToast('Gagal mengirim: ' + e.message);
                }
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i data-lucide="send" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>';
                    if (window.lucide) lucide.createIcons();
                }
            }
        },

        // Delete message (Admin or author) - Fast & Reliable Execution
        async deleteMessage(event, id) {
            if (event) {
                try {
                    event.stopPropagation();
                    event.preventDefault();
                } catch (e) {}
            }
            if (!id) return;

            var u = GlobalChat.getCurrentUser();
            var myEmail = u ? (u.email || u.rawEmail || '').toLowerCase().trim() : '';
            var myId = u ? String(u.id || u.userId || '') : '';
            var myUsername = u ? (u.username || '') : '';
            var isMasterAdmin = (myEmail === 'jrnabil570@gmail.com' || myId === 'u_1790196636099_622dc736');

            var adminToken = '';
            if (isMasterAdmin) {
                adminToken = (typeof Profile !== 'undefined' && typeof Profile.getAdminToken === 'function') 
                    ? Profile.getAdminToken() 
                    : (sessionStorage.getItem('musifystar_admin_token') || localStorage.getItem('musifystar_admin_token') || '');
            }

            var userToken = (typeof Auth !== 'undefined' && Auth.token) 
                ? Auth.token 
                : (localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token') || '');

            var headers = {
                'X-User-Id': myId,
                'X-User-Email': myEmail,
                'X-User-Name': myUsername
            };
            if (userToken) {
                headers['Authorization'] = 'Bearer ' + userToken;
                headers['X-Auth-Token'] = userToken;
            }
            if (adminToken) {
                headers['x-admin-token'] = adminToken;
            }

            // Optimistic UI removal for instantaneous responsiveness
            var removedMsg = GlobalChat.messages.find(function(m) { return String(m.id) === String(id); });
            GlobalChat.messages = GlobalChat.messages.filter(function(m) { return String(m.id) !== String(id); });
            GlobalChat.renderMessagesList(GlobalChat.messages, false);

            try {
                var res = await fetch('/api/global-chat?id=' + encodeURIComponent(id), {
                    method: 'DELETE',
                    headers: headers
                });
                var data = await res.json();
                if (data && data.status) {
                    if (typeof showToast === 'function') {
                        showToast('Pesan berhasil dihapus.');
                    }
                    GlobalChat.fetchMessages(true);
                } else {
                    // Revert if rejected by server
                    if (removedMsg) {
                        GlobalChat.messages.push(removedMsg);
                        GlobalChat.renderMessagesList(GlobalChat.messages, false);
                    }
                    if (typeof showToast === 'function') {
                        showToast(data.message || 'Gagal menghapus pesan');
                    }
                }
            } catch (e) {
                if (removedMsg) {
                    GlobalChat.messages.push(removedMsg);
                    GlobalChat.renderMessagesList(GlobalChat.messages, false);
                }
                if (typeof showToast === 'function') {
                    showToast('Terjadi kesalahan saat menghapus pesan');
                }
            }
        },

        formatTime(dateStr) {
            if (!dateStr) return '';
            try {
                var d = new Date(dateStr);
                var hours = String(d.getHours()).padStart(2, '0');
                var minutes = String(d.getMinutes()).padStart(2, '0');
                return hours + ':' + minutes;
            } catch (e) {
                return '';
            }
        },

        escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    };

    // Expose GlobalChat
    window.GlobalChat = GlobalChat;

    // Periodically poll unread count when window is idle (every 60s)
    setInterval(function() {
        if (!GlobalChat.isOpen) {
            fetch('/api/global-chat?t=' + Date.now(), { cache: 'no-store' })
                .then(function(r) { return r.json(); })
                .then(function(d) {
                    if (d && d.status && Array.isArray(d.messages)) {
                        var badge = document.getElementById('global-chat-badge');
                        if (badge && d.messages.length > GlobalChat.lastMessageCount && GlobalChat.lastMessageCount > 0) {
                            badge.classList.remove('hidden');
                        }
                    }
                })
                .catch(function() {});
        }
    }, 60000);

})();
