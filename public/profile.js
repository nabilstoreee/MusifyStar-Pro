var Profile = {
    appVersion: 'v1.0.0',
    appReleaseName: 'MusifyStar Official',

    async fetchAppVersion() {
        try {
            var res = await fetch('/api/version');
            var data = await res.json();
            if (data && data.status && data.version) {
                Profile.appVersion = data.version;
                Profile.appReleaseName = data.releaseName || 'MusifyStar Official';
                var vEl = gid('profile-app-version');
                if (vEl) vEl.innerText = data.version;
                var vBadge = gid('admin-version-tab-badge');
                if (vBadge) vBadge.innerText = data.version;
            }
        } catch (e) {}
    },

    render() {
        var el = gid('view-dev');
        if (!el) return;
        Profile.fetchAppVersion();

        var uAvatar = (window.Auth && Auth.currentUser && Auth.currentUser.avatar) ? Auth.currentUser.avatar : '/logo.png';
        var hasUser = !!(window.Auth && Auth.currentUser);

        el.innerHTML = `
        <div class="pt-8 pb-3.5 px-4 sticky top-0 z-30 border-b border-white/10 shadow-2xl transition-all" style="background: linear-gradient(180deg, rgba(13, 15, 22, 0.88) 0%, rgba(13, 15, 22, 0.97) 100%), url('/banner.png') center/cover no-repeat; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
            <div class="flex items-center">
                <h1 class="text-3xl font-black text-white tracking-tight drop-shadow-md">Developer</h1>
            </div>
        </div>
        <div class="pt-6 px-4 text-center">
            <div class="relative w-20 h-20 rounded-full mx-auto mb-3 glass-strong shine-sweep flex items-center justify-center overflow-hidden shadow-black/50">
                <i data-lucide="music" class="w-10 h-10 text-white/60 absolute"></i>
                <img src="/logo.png" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'" />
            </div>
            <div class="flex items-center justify-center gap-2 mb-1">
                <h2 class="text-2xl font-black chrome-text tracking-tight">MusifyStar</h2>
                <span class="inline-flex items-center justify-center shrink-0 cursor-default select-none" title="Akun & Aplikasi Terverifikasi Resmi">
                    <svg class="w-5 h-5 drop-shadow-[0_2px_8px_rgba(56,189,248,0.55)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="url(#musify_verified_blue_grad)"/>
                        <path d="M7.8 12.2L10.8 15.2L16.2 9.2" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="musify_verified_blue_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#38bdf8"/>
                                <stop offset="1" stop-color="#0284c7"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
            </div>
            <p class="text-[#b3b3b3] text-xs mb-6">Nikmati Streaming Musik Dengan Lirik</p>

            <div class="glass rounded-2xl p-5 max-w-sm mx-auto space-y-3 text-left mb-6">
                <h3 class="text-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <i data-lucide="smartphone" class="w-4 h-4 text-rose-400"></i> Informasi & Aplikasi MusifyStar
                </h3>
                <div class="flex justify-between"><span class="text-white/70 text-sm">Nama</span><span class="text-white font-medium text-sm">MusifyStar</span></div>
                <div class="flex justify-between"><span class="text-white/70 text-sm">Versi</span><span id="profile-app-version" class="text-white font-medium text-sm">${Profile.appVersion || 'v1.0.0'}</span></div>
                <div class="flex justify-between"><span class="text-white/70 text-sm">Mode Offline APK</span><span class="text-emerald-400 font-bold text-sm flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Aktif</span></div>
                <div class="flex justify-between"><span class="text-white/70 text-sm">Service Worker</span><span class="text-white font-medium text-sm">${'serviceWorker' in navigator ? 'Terdaftar' : 'Tidak didukung'}</span></div>
                <div class="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span class="text-white/70 text-xs">Cache APK tersimpan</span>
                    <button onclick="if(typeof clearPwaCache==='function') clearPwaCache();" class="text-xs text-rose-400 hover:text-rose-300 font-semibold underline active:scale-95">Bersihkan Cache</button>
                </div>
            </div>

            <div class="glass rounded-2xl p-5 max-w-sm mx-auto space-y-4 text-left mb-6">
                <h3 class="text-white font-bold text-sm uppercase tracking-wider mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                    <i data-lucide="code" class="w-4 h-4 text-rose-400"></i> Developer Profile
                </h3>
                <div onclick="Profile.openAdminModal()" class="flex justify-between items-center cursor-pointer active:opacity-75 transition-opacity" title="Developed by MusifyStar StudioMusik">
                    <span class="text-white/70 text-sm font-medium">Developed by</span>
                    <div class="flex items-center gap-2">
                        <img src="/dev.png" class="w-6 h-6 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" onerror="this.src='/logo.png'" />
                        <span class="text-white font-bold text-sm">MusifyStar StudioMusik</span>
                    </div>
                </div>

                <div class="pt-1">
                    <div class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <i data-lucide="heart" class="w-3.5 h-3.5 text-red-400 fill-current"></i> Lagu Yang Disukai
                    </div>
                    <p class="text-sm font-medium text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">Bawa Dia Kembali | MAHALINI</p>
                </div>

                <div>
                    <div class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <i data-lucide="disc" class="w-3.5 h-3.5 text-purple-400"></i> Playlist Yang Disukai
                    </div>
                    <p class="text-sm font-medium text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">Semua album Piche Kota</p>
                </div>

                <div>
                    <div class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <i data-lucide="user" class="w-3.5 h-3.5 text-sky-400"></i> Developer Pembuat
                    </div>
                    <p class="text-sm font-medium text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">Nabil Assihidiqi</p>
                </div>

                <!-- Tombol User Feedback & Donasi QRIS di luar di bawah Nabil Assihidiqi -->
                <div class="pt-2 border-t border-white/10 space-y-2">
                    <button onclick="Profile.openFeedbackModal()" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-transparent hover:from-rose-500/25 hover:to-purple-500/25 border border-rose-500/30 text-white font-semibold text-xs flex items-center justify-between group active:scale-95 transition-all shadow-md cursor-pointer" title="Kirim masukan atau pesan ke pengembang">
                        <span class="flex items-center gap-2">
                            <i data-lucide="message-square-plus" class="w-4 h-4 text-rose-400"></i>
                            <span>Kirim Pesan & Masukan Pengguna</span>
                        </span>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
                    </button>

                    <!-- Tombol Fitur Donasi Gambar QRIS -->
                    <button onclick="Profile.openDonationModal()" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent hover:from-amber-500/25 hover:to-emerald-500/25 border border-amber-500/30 text-white font-semibold text-xs flex items-center justify-between group active:scale-95 transition-all shadow-md cursor-pointer" title="Donasi & Dukung Pengembang MusifyStar">
                        <span class="flex items-center gap-2">
                            <i data-lucide="heart-handshake" class="w-4 h-4 text-amber-400"></i>
                            <span>Donasi Pengembang (QRIS)</span>
                        </span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">QRIS</span>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
                        </div>
                    </button>

                    <!-- Tombol Kotak Masuk Pesan Admin (Direct User Messaging) -->
                    <button onclick="Profile.openUserInboxModal()" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-transparent hover:from-blue-500/25 hover:to-cyan-500/25 border border-blue-500/30 text-white font-semibold text-xs flex items-center justify-between group active:scale-95 transition-all shadow-md cursor-pointer" title="Kotak Masuk Pesan dari Admin">
                        <span class="flex items-center gap-2">
                            <i data-lucide="mail" class="w-4 h-4 text-cyan-400"></i>
                            <span>Kotak Masuk Pesan Admin</span>
                        </span>
                        <div class="flex items-center gap-1.5">
                            <span id="user-inbox-badge" class="hidden text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono shadow-sm">0</span>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
                        </div>
                    </button>

                    <!-- Tombol Buka Formulir Login / Daftar (atau Edit Profil jika sudah login) di bawah Donasi -->
                    ${hasUser ? `
                    <button onclick="Auth.openUserProfileModal()" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-transparent hover:from-emerald-500/25 hover:to-sky-500/25 border border-emerald-500/30 text-white font-semibold text-xs flex items-center justify-between group active:scale-95 transition-all shadow-md cursor-pointer" title="Profil Akun Anda">
                        <span class="flex items-center gap-2">
                            <img src="${uAvatar}" class="w-4 h-4 rounded-full object-cover border border-white/20" onerror="this.src='/logo.png'">
                            <span class="truncate max-w-[200px]">Akun: ${es(Auth.currentUser.username)} Edit Profil</span>
                        </span>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
                    </button>` : `
                    <button onclick="Auth.toggleTopDropdown(this)" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#35eaff]/15 via-[#ff10de]/15 to-transparent hover:from-[#35eaff]/25 hover:to-[#ff10de]/25 border border-[#35eaff]/30 text-white font-bold text-xs flex items-center justify-between group active:scale-95 transition-all shadow-md cursor-pointer" title="Buka Formulir Login / Daftar">
                        <span class="flex items-center gap-2">
                            <i data-lucide="log-in" class="w-4 h-4 text-[#35eaff]"></i>
                            <span>Buka Formulir Login / Daftar</span>
                        </span>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
                    </button>`}
                </div>
            </div>
            
            <button id="pwa-install-btn" onclick="installPWA()" class="${typeof isStandaloneApp !== 'undefined' && isStandaloneApp ? 'hidden ' : ''}w-full max-w-sm mx-auto btn-chrome font-bold py-4 rounded-full active:scale-95 transition-all text-center flex items-center justify-center gap-2 mb-3">
                <i data-lucide="download" class="w-5 h-5"></i> Install Aplikasi
            </button>

            <a href="https://whatsapp.com/channel/0029VbDRf3P9WtC9ZjQ3gq3B" target="_blank" class="block w-full max-w-sm mx-auto btn-chrome font-bold py-4 rounded-full active:scale-95 transition-all text-center flex items-center justify-center gap-2">
                <i data-lucide="message-circle" class="w-5 h-5"></i> Gabung Channel WhatsApp
            </a>
        </div>`;
        lucide.createIcons();
        Profile.checkUserInboxBadge();
    },

    // Helper Sensored / Masked Email
    maskEmail(email) {
        if (!email || typeof email !== 'string' || !email.includes('@')) return email || '';
        var parts = email.split('@');
        var local = parts[0];
        var domain = parts[1];
        if (local.length <= 2) {
            return local.charAt(0) + '*@' + domain;
        } else if (local.length <= 4) {
            return local.charAt(0) + '**' + local.charAt(local.length - 1) + '@' + domain;
        } else {
            var start = local.substring(0, 2);
            var end = local.substring(local.length - 2);
            var stars = '*'.repeat(Math.min(6, local.length - 4));
            return start + stars + end + '@' + domain;
        }
    },

    // MODAL KIRIM MASUKAN (USER FEEDBACK FORM)
    openFeedbackModal() {
        var existing = gid('musifystar-feedback-modal');
        if (existing) existing.remove();

        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var defaultName = u ? (u.username || '') : '';
        var defaultContact = u ? (u.email || '') : '';

        var modal = document.createElement('div');
        modal.id = 'musifystar-feedback-modal';
        modal.className = 'fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in';
        modal.innerHTML = `
        <div class="w-full max-w-md bg-[#11131a] border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-7" style="box-shadow: 0 25px 50px -12px rgba(244,63,94,0.25);">
            
            <!-- Close Button -->
            <button onclick="Profile.closeFeedbackModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>

            <!-- Icon & Header -->
            <div class="text-center mb-4 pt-1">
                <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                    <i data-lucide="message-square" class="w-6 h-6"></i>
                </div>
                <h2 class="text-lg font-black text-white tracking-tight">Kirim Pesan & Masukan</h2>
                <p class="text-xs text-white/60 mt-1">Sampaikan saran, kritik, atau pesan untuk pengembang MusifyStar.</p>
                ${u ? `<div class="mt-2 text-[11px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-xl inline-flex items-center gap-1.5 font-medium">
                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i> Terautentikasi sebagai <strong>${u.username}</strong>
                </div>` : ''}
            </div>

            <!-- Error/Status Banner -->
            <div id="fb-status-box" class="hidden mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                <span id="fb-status-msg"></span>
            </div>

            <!-- Form -->
            <form onsubmit="Profile.submitFeedback(event)" class="space-y-3.5">
                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1">Nama <span class="text-rose-400"></span></label>
                    <input type="text" id="fb-name" required value="${defaultName}" placeholder="Tuliskan nama Anda" class="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-500 transition-colors" />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1">Masukkan Pesan <span class="text-rose-400"></span></label>
                    <textarea id="fb-message" required rows="4" placeholder="Tuliskan saran, kritik, atau pesan yang ingin disampaikan..." class="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-500 transition-colors resize-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1">Email / Nomer Jika Ingin Dibalas <span class="text-white/40 text-[11px]">(Opsional)</span></label>
                    <input type="text" id="fb-contact" value="${defaultContact}" placeholder="+62 atau email@gmail.com" class="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-500 transition-colors" />
                </div>

                <button type="submit" id="fb-submit-btn" class="w-full btn-chrome font-bold py-3.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 mt-2 shadow-lg cursor-pointer">
                    <i data-lucide="send" class="w-4 h-4"></i>
                    <span>Kirim Pesan</span>
                </button>
            </form>
        </div>`;

        document.body.appendChild(modal);
        lucide.createIcons();
    },

    closeFeedbackModal() {
        var modal = gid('musifystar-feedback-modal');
        if (modal) modal.remove();
    },

    // MODAL DONASI QRIS & REKENING PENGEMBANG (DYNAMIC)
    async openDonationModal() {
        var existing = gid('musifystar-donation-modal');
        if (existing) existing.remove();

        // Ambil konfigurasi dinamis dari server
        var config = Profile.cachedPaymentConfig;
        try {
            var res = await fetch('/api/payment-config?t=' + Date.now());
            var data = await res.json();
            if (data && data.status && data.config) {
                config = data.config;
                Profile.cachedPaymentConfig = config;
            }
        } catch(e) {}

        if (!config) {
            config = {
                qrisUrl: '/qris.png',
                qrisFilename: 'QRIS-MusifyStar-Nabil.png',
                accounts: [
                    { bankName: 'SeaBank', accountNumber: '9012 3456 7890', accountHolder: 'NABIL (MusifyStar)', badge: 'Prioritas Bebas Admin', icon: 'credit-card' },
                    { bankName: 'DANA / GoPay', accountNumber: '0812 3456 7890', accountHolder: 'NABIL', badge: 'E-Wallet', icon: 'smartphone' }
                ],
                title: 'Dukung Pengembang MusifyStar',
                description: 'Donasi sukarela Anda sangat berharga untuk biaya sewa server & pengembangan aplikasi MusifyStar.',
                note: 'Semua dana donasi digunakan untuk perawatan server & penambahan fitur baru agar aplikasi tetap gratis tanpa iklan.'
            };
        }

        var accountsListHtml = '';
        if (Array.isArray(config.accounts) && config.accounts.length > 0) {
            accountsListHtml = config.accounts.map(function(acc, idx) {
                var safeNum = String(acc.accountNumber || '').trim();
                var safeBank = String(acc.bankName || 'Bank').trim();
                var safeHolder = String(acc.accountHolder || '').trim();
                var safeBadge = String(acc.badge || 'Transfer').trim();
                return `
                <div class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group">
                    <div class="space-y-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-white tracking-wide">${safeBank}</span>
                            <span class="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">${safeBadge}</span>
                        </div>
                        <div class="font-mono text-sm sm:text-base font-black text-amber-400 tracking-wider truncate select-all">
                            ${safeNum}
                        </div>
                        <p class="text-[11px] text-white/50 truncate">a.n. <strong class="text-white/80">${safeHolder}</strong></p>
                    </div>
                    <button type="button" onclick="Profile.copyAccountNumber('${safeNum}', this)" class="shrink-0 py-2 px-3 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                        <span>Salin</span>
                    </button>
                </div>`;
            }).join('');
        } else {
            accountsListHtml = '<p class="text-xs text-white/50 text-center py-6">Belum ada nomor rekening yang ditambahkan oleh admin.</p>';
        }

        var modal = document.createElement('div');
        modal.id = 'musifystar-donation-modal';
        modal.className = 'fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in';
        modal.innerHTML = `
        <div class="w-full max-w-sm sm:max-w-md bg-[#11131a] border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]" style="box-shadow: 0 25px 50px -12px rgba(245,158,11,0.25);">
            <!-- Close Button -->
            <button onclick="Profile.closeDonationModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer z-10">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>

            <!-- Header -->
            <div class="text-center p-5 pb-3 shrink-0">
                <div class="w-11 h-11 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    <i data-lucide="heart-handshake" class="w-5 h-5"></i>
                </div>
                <h2 class="text-base sm:text-lg font-black text-white tracking-tight">${config.title || 'Dukung Pengembang MusifyStar'}</h2>
                <p class="text-xs text-white/60 mt-1 max-w-xs mx-auto leading-relaxed">${config.description || 'Donasi sukarela Anda sangat berharga untuk biaya sewa server & pengembangan aplikasi MusifyStar.'}</p>
            </div>

            <!-- Subtab Switcher: QRIS vs Rekening Transfer -->
            <div class="px-5 mb-3 shrink-0">
                <div class="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl gap-1">
                    <button id="don-tab-btn-qris" onclick="Profile.setDonationSubTab('qris')" class="py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md">
                        <i data-lucide="qr-code" class="w-3.5 h-3.5"></i>
                        <span>Barcode QRIS</span>
                    </button>
                    <button id="don-tab-btn-accounts" onclick="Profile.setDonationSubTab('accounts')" class="py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white/70 hover:text-white hover:bg-white/5">
                        <i data-lucide="credit-card" class="w-3.5 h-3.5"></i>
                        <span>Rekening & E-Wallet</span>
                    </button>
                </div>
            </div>

            <!-- Scrollable Body Content -->
            <div class="flex-1 overflow-y-auto px-5 pb-5 space-y-3.5 hide-scrollbar">
                <!-- PANEL 1: QRIS VIEW -->
                <div id="don-view-qris" class="space-y-3">
                    <div class="w-full flex items-center justify-center overflow-hidden rounded-2xl select-none bg-white/5 p-2 border border-white/10" 
                         style="-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;"
                         oncontextmenu="return false;">
                        <img id="qris-img-display" 
                             src="${config.qrisUrl || '/qris.png'}" 
                             alt="QRIS MusifyStar" 
                             draggable="false"
                             oncontextmenu="return false;"
                             class="w-full h-auto max-h-[46vh] object-contain rounded-xl shadow-2xl pointer-events-none select-none" 
                             style="-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;pointer-events:none;"
                             onerror="this.src='/qris.png'" />
                    </div>
                    <p class="text-[11px] text-white/50 text-center leading-relaxed">
                        Scan dengan GoPay, OVO, DANA, BCA, BRI, Mandiri, BNI, ShopeePay & semua bank / mobile banking di Indonesia.
                    </p>
                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <button id="btn-save-qris" onclick="Profile.downloadQRIS('${config.qrisUrl || '/qris.png'}', '${config.qrisFilename || 'QRIS-MusifyStar-Nabil.png'}')" class="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-95 active:scale-95 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-center">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span>Simpan QRIS</span>
                        </button>
                        <button onclick="Profile.closeDonationModal()" class="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer text-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                            <span>Tutup</span>
                        </button>
                    </div>
                </div>

                <!-- PANEL 2: REKENING & E-WALLET VIEW -->
                <div id="don-view-accounts" class="hidden space-y-2.5">
                    ${accountsListHtml}
                    ${config.note ? `
                    <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-[11px] leading-relaxed flex items-start gap-2">
                        <i data-lucide="info" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
                        <span>${config.note}</span>
                    </div>` : ''}
                    <div class="pt-2">
                        <button onclick="Profile.closeDonationModal()" class="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer text-center">
                            <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
                            <span>Selesai</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        modal.onclick = function(e) {
            if (e.target === modal) Profile.closeDonationModal();
        };

        document.body.appendChild(modal);
        lucide.createIcons();
    },

    setDonationSubTab(tab) {
        var btnQris = gid('don-tab-btn-qris');
        var btnAcc = gid('don-tab-btn-accounts');
        var viewQris = gid('don-view-qris');
        var viewAcc = gid('don-view-accounts');

        var activeClass = 'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500 to-emerald-500 text-black shadow-md';
        var inactiveClass = 'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white/70 hover:text-white hover:bg-white/5';

        if (btnQris) btnQris.className = tab === 'qris' ? activeClass : inactiveClass;
        if (btnAcc) btnAcc.className = tab === 'accounts' ? activeClass : inactiveClass;
        if (viewQris) viewQris.classList.toggle('hidden', tab !== 'qris');
        if (viewAcc) viewAcc.classList.toggle('hidden', tab !== 'accounts');
    },

    copyAccountNumber(accNumber, btnEl) {
        if (!accNumber) return;
        var clean = String(accNumber).replace(/\s+/g, '');
        var doFeedback = function() {
            if (btnEl) {
                var originalHtml = btnEl.innerHTML;
                btnEl.className = 'shrink-0 py-2 px-3 rounded-xl bg-emerald-500 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md';
                btnEl.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Tersalin!</span>';
                if (typeof lucide !== 'undefined') lucide.createIcons();
                setTimeout(function() {
                    btnEl.className = 'shrink-0 py-2 px-3 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm';
                    btnEl.innerHTML = originalHtml;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 2200);
            }
            if (typeof showToast === 'function') {
                showToast('Nomor rekening ' + clean + ' disalin ke clipboard');
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(clean).then(doFeedback).catch(function() {
                prompt('Salin nomor rekening:', clean);
            });
        } else {
            prompt('Salin nomor rekening:', clean);
        }
    },

    closeDonationModal() {
        var modal = gid('musifystar-donation-modal');
        if (modal) modal.remove();
    },

    downloadQRIS(targetUrl, targetFilename) {
        var btn = gid('btn-save-qris');
        if (btn) {
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Menyimpan...</span>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        var fetchUrl = targetUrl || (Profile.cachedPaymentConfig && Profile.cachedPaymentConfig.qrisUrl) || '/qris.png';
        var filename = targetFilename || (Profile.cachedPaymentConfig && Profile.cachedPaymentConfig.qrisFilename) || 'QRIS-MusifyStar-Nabil.png';

        // Ambil data binary murni gambar PNG via Blob URL
        fetch(fetchUrl)
            .then(function(res) {
                if (!res.ok) throw new Error('Network error');
                return res.blob();
            })
            .then(function(blob) {
                var pngBlob = new Blob([blob], { type: 'image/png' });
                var blobUrl = URL.createObjectURL(pngBlob);
                var tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobUrl;
                tempLink.download = filename;
                document.body.appendChild(tempLink);
                tempLink.click();

                setTimeout(function() {
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(blobUrl);
                    if (btn) {
                        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Tersimpan!</span>';
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                        setTimeout(function() {
                            if (btn) {
                                btn.innerHTML = '<i data-lucide="download" class="w-4 h-4"></i><span>Simpan QRIS</span>';
                                if (typeof lucide !== 'undefined') lucide.createIcons();
                            }
                        }, 2500);
                    }
                    if (typeof showToast === 'function') {
                        showToast('Gambar QRIS asli berhasil diunduh');
                    }
                }, 150);
            })
            .catch(function(err) {
                console.warn('Fallback download QRIS:', err);
                // Fallback 1: Canvas export
                try {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function(b) {
                            if (b) {
                                var url = URL.createObjectURL(b);
                                var a = document.createElement('a');
                                a.href = url;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            } else {
                                window.location.href = '/api/download-qris';
                            }
                            if (btn) {
                                btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Tersimpan!</span>';
                                if (typeof lucide !== 'undefined') lucide.createIcons();
                            }
                        }, 'image/png');
                    };
                    img.onerror = function() {
                        window.location.href = '/api/download-qris';
                    };
                    img.src = '/qris.png';
                } catch (e) {
                    window.location.href = '/api/download-qris';
                }
            });
    },

    copyDonationInfo() {
        var text = "Dukungan Donasi QRIS MusifyStar\\nPengembang: Nabil Assihidiqi\\nDapat di-scan melalui aplikasi GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, BRI, BNI, dan semua e-Wallet / Mobile Banking di Indonesia.";
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                var btnText = gid('copy-donation-btn-text');
                if (btnText) {
                    btnText.innerText = 'Tersalin!';
                    setTimeout(function() {
                        if (btnText) btnText.innerText = 'Salin Info';
                    }, 2500);
                }
            }).catch(function() {
                alert('Info donasi: Scan QRIS atas nama Nabil Assihidiqi di aplikasi pembayaran Anda.');
            });
        } else {
            alert('Info donasi: Scan QRIS atas nama Nabil Assihidiqi di aplikasi pembayaran Anda.');
        }
    },

    // Submit Feedback ke Server
    async submitFeedback(event) {
        event.preventDefault();

        var nameEl = gid('fb-name');
        var msgEl = gid('fb-message');
        var contactEl = gid('fb-contact');
        var statusBox = gid('fb-status-box');
        var statusMsg = gid('fb-status-msg');
        var submitBtn = gid('fb-submit-btn');

        var name = (nameEl ? nameEl.value : '').trim();
        var message = (msgEl ? msgEl.value : '').trim();
        var contact = (contactEl ? contactEl.value : '').trim();

        if (!name || !message) return;

        if (statusBox) statusBox.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70');
            submitBtn.innerHTML = `<span>Mengirim...</span>`;
        }

        try {
            var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
            var userLogged = !!u;
            var username = u ? (u.username || '') : '';
            var email = u ? (u.email || '') : '';
            var userAvatar = u ? (u.avatar || '') : '';

            var res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    message: message,
                    contact: contact,
                    userLogged: userLogged,
                    username: username,
                    email: email,
                    userAvatar: userAvatar
                })
            });
            var data = await res.json();

            if (data.status) {
                Profile.closeFeedbackModal();
                if (typeof showToast === 'function') {
                    showToast('Pesan dan masukan Anda berhasil terkirim. Terima kasih!');
                }
            } else {
                if (statusBox && statusMsg) {
                    statusMsg.innerText = data.message || 'Gagal mengirim pesan';
                    statusBox.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-70');
                    submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> <span>Kirim Pesan</span>`;
                    lucide.createIcons();
                }
            }
        } catch (err) {
            if (statusBox && statusMsg) {
                statusMsg.innerText = 'Koneksi bermasalah saat mengirim pesan';
                statusBox.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
                submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> <span>Kirim Pesan</span>`;
                lucide.createIcons();
            }
        }
    },

    getAdminToken() {
        return sessionStorage.getItem('musifystar_admin_token') || localStorage.getItem('musifystar_admin_token') || '';
    },

    setAdminToken(token) {
        if (token) {
            try { sessionStorage.setItem('musifystar_admin_token', token); } catch(e){}
            try { localStorage.setItem('musifystar_admin_token', token); } catch(e){}
        } else {
            try { sessionStorage.removeItem('musifystar_admin_token'); } catch(e){}
            try { localStorage.removeItem('musifystar_admin_token'); } catch(e){}
        }
    },

    // Buka dialog Akses Admin
    async openAdminModal() {
        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var isMasterAdmin = u && ((u.email || u.rawEmail || '').toLowerCase().trim() === 'jrnabil570@gmail.com');
        if (!isMasterAdmin) {
            if (typeof showToast === 'function') {
                showToast('Akses Ditolak Hanya Admin Yang Bisa Akses');
            }
            return;
        }

        var token = Profile.getAdminToken();
        if (token) {
            try {
                var res = await fetch('/api/admin-auth', {
                    headers: { 'x-admin-token': token }
                });
                var data = await res.json();
                if (data.authenticated) {
                    Profile.renderAdminDashboard();
                    return;
                }
            } catch (e) {}
            Profile.setAdminToken(null);
        }

        // Tampilkan layar Login / Verifikasi Kredensial
        Profile.renderAdminLogin();
    },

    closeAdminModal() {
        if (Profile.adminRefreshInterval) {
            clearInterval(Profile.adminRefreshInterval);
            Profile.adminRefreshInterval = null;
        }
        var modal = gid('musifystar-admin-modal');
        if (modal) modal.remove();
    },

    // Tampilan Formulir Login Admin (Username & Password)
    async renderAdminLogin() {
        var existing = gid('musifystar-admin-modal');
        if (existing) existing.remove();

        var isSetup = false;
        try {
            var statusRes = await fetch('/api/admin-auth');
            var statusData = await statusRes.json();
            if (statusData && !statusData.hasCredentials) {
                isSetup = true;
            }
        } catch (e) {}

        var modal = document.createElement('div');
        modal.id = 'musifystar-admin-modal';
        modal.className = 'fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in';
        modal.innerHTML = `
        <div class="w-full max-w-md bg-[#11131a] border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-7" style="box-shadow: 0 25px 50px -12px rgba(244,63,94,0.25);">
            
            <!-- Close Button -->
            <button onclick="Profile.closeAdminModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>

            <!-- Icon & Header -->
            <div class="text-center mb-6 pt-2">
                <div class="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                    <i data-lucide="lock" class="w-7 h-7"></i>
                </div>
                <h2 class="text-xl font-black text-white tracking-tight">Akses Administrator</h2>
                <p class="text-xs text-white/60 mt-1">
                    ${isSetup ? 'Pengaturan Awal: Buat Username & Password admin baru' : 'Masukkan kredensial Anda untuk melanjutkan'}
                </p>
            </div>

            <!-- Error Banner -->
            <div id="admin-login-error" class="hidden mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                <span id="admin-login-error-msg"></span>
            </div>

            <!-- Form -->
            <form onsubmit="Profile.handleAdminAuth(event, ${isSetup})" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Username</label>
                    <div class="relative">
                        <i data-lucide="user" class="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                        <input type="text" id="admin-input-user" required autocomplete="off" placeholder="Masukkan username" class="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-500 transition-colors" />
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Password</label>
                    <div class="relative">
                        <i data-lucide="key" class="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                        <input type="password" id="admin-input-pass" required autocomplete="current-password" placeholder="Masukkan password" class="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-500 transition-colors" />
                    </div>
                </div>

                <button type="submit" id="admin-submit-btn" class="w-full btn-chrome font-bold py-3.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 mt-2 shadow-lg">
                    <i data-lucide="log-in" class="w-4 h-4"></i>
                    <span>${isSetup ? 'Simpan & Masuk' : 'Masuk Admin'}</span>
                </button>
            </form>
        </div>`;

        document.body.appendChild(modal);
        lucide.createIcons();
    },

    // Handle verifikasi Login / Setup
    async handleAdminAuth(event, isSetup) {
        event.preventDefault();

        var userInput = gid('admin-input-user');
        var passInput = gid('admin-input-pass');
        var errorBox = gid('admin-login-error');
        var errorMsg = gid('admin-login-error-msg');
        var submitBtn = gid('admin-submit-btn');

        var username = (userInput ? userInput.value : '').trim();
        var password = (passInput ? passInput.value : '');

        if (!username || !password) return;

        if (errorBox) errorBox.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70');
            submitBtn.innerText = 'Memverifikasi...';
        }

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isSetup ? 'setup' : 'login',
                    username: username,
                    password: password
                })
            });
            var data = await res.json();

            if (data.require2FA && data.tempToken) {
                Profile.render2FALoginStep(data.tempToken);
            } else if (data.success && data.token) {
                Profile.setAdminToken(data.token);
                if (typeof showToast === 'function') {
                    showToast(isSetup ? 'Kredensial berhasil dibuat! Masuk admin.' : 'Login admin berhasil!');
                }
                Profile.renderAdminDashboard();
            } else {
                if (errorBox && errorMsg) {
                    errorMsg.innerText = data.message || 'Username atau password salah';
                    errorBox.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-70');
                    submitBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i> <span>${isSetup ? 'Simpan & Masuk' : 'Masuk Admin'}</span>`;
                    lucide.createIcons();
                }
            }
        } catch (err) {
            if (errorBox && errorMsg) {
                errorMsg.innerText = 'Gagal menghubungi server autentikasi';
                errorBox.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
                submitBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i> <span>${isSetup ? 'Simpan & Masuk' : 'Masuk Admin'}</span>`;
                lucide.createIcons();
            }
        }
    },

    render2FALoginStep(tempToken) {
        var modal = gid('musifystar-admin-modal');
        if (!modal) {
            Profile.renderAdminLogin();
            modal = gid('musifystar-admin-modal');
        }
        if (!modal) return;

        modal.innerHTML = `
        <div class="w-full max-w-md bg-[#11131a] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-7" style="box-shadow: 0 25px 50px -12px rgba(16,185,129,0.25);">
            
            <!-- Close Button -->
            <button onclick="Profile.closeAdminModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>

            <!-- Icon & Header -->
            <div class="text-center mb-6 pt-2">
                <div class="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <i data-lucide="shield-check" class="w-7 h-7"></i>
                </div>
                <h2 class="text-xl font-black text-white tracking-tight">Verifikasi</h2>
                <p class="text-xs text-white/60 mt-1">
                    Masukkan 6 digit kode OTP dari Authenticator
                </p>
            </div>

            <!-- Error Banner -->
            <div id="admin-2fa-error" class="hidden mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                <span id="admin-2fa-error-msg"></span>
            </div>

            <!-- Form -->
            <form onsubmit="Profile.handleVerify2FALogin(event, '${tempToken}')" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider text-center">Kode OTP (6 Digit)</label>
                    <input type="text" id="admin-otp-input" required maxlength="6" pattern="[0-9]{6}" inputmode="numeric" autocomplete="one-time-code" placeholder="000000" class="w-full text-center text-2xl font-mono tracking-[0.4em] py-3 bg-black/50 border border-white/20 rounded-xl text-emerald-400 placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-colors" autofocus />
                </div>

                <button type="submit" id="admin-otp-submit-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                    <span>Verifikasi & Masuk</span>
                </button>

                <div class="text-center pt-1">
                    <button type="button" onclick="Profile.renderAdminLogin()" class="text-xs text-white/50 hover:text-white transition-all underline cursor-pointer">
                        Kembali ke Login Username & Password
                    </button>
                </div>
            </form>
        </div>`;

        lucide.createIcons();
        setTimeout(function() {
            var inp = gid('admin-otp-input');
            if (inp) inp.focus();
        }, 100);
    },

    async handleVerify2FALogin(event, tempToken) {
        if (event && event.preventDefault) event.preventDefault();
        var otpInput = gid('admin-otp-input');
        var errorBox = gid('admin-2fa-error');
        var errorMsg = gid('admin-2fa-error-msg');
        var submitBtn = gid('admin-otp-submit-btn');

        var otp = otpInput ? otpInput.value.trim() : '';
        if (!otp || otp.length !== 6) return;

        if (errorBox) errorBox.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Memverifikasi OTP...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify_2fa',
                    tempToken: tempToken,
                    otp: otp
                })
            });
            var data = await res.json();

            if (data.success && data.token) {
                Profile.setAdminToken(data.token);
                if (typeof showToast === 'function') {
                    showToast('Verifikasi 2FA berhasil! Selamat datang Admin.');
                }
                Profile.renderAdminDashboard();
            } else {
                if (errorBox && errorMsg) {
                    errorMsg.innerText = data.message || 'Kode OTP salah atau kedaluwarsa';
                    errorBox.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> <span>Verifikasi & Masuk</span>';
                    lucide.createIcons();
                }
            }
        } catch (e) {
            if (errorBox && errorMsg) {
                errorMsg.innerText = 'Gagal memverifikasi OTP dengan server';
                errorBox.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> <span>Verifikasi & Masuk</span>';
                lucide.createIcons();
            }
        }
    },

    // State Tab Admin
    adminActiveTab: 'analytics',
    adminRefreshInterval: null,

    // Tampilan Area Admin: User Feedback Inbox & Analytics
    async renderAdminDashboard() {
        var existing = gid('musifystar-admin-modal');
        if (existing) existing.remove();

        var token = Profile.getAdminToken();

        var modal = document.createElement('div');
        modal.id = 'musifystar-admin-modal';
        modal.className = 'fixed inset-0 z-[250] flex items-center justify-center p-2.5 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in';
        modal.innerHTML = `
        <div class="w-full max-w-4xl h-[90vh] max-h-[850px] bg-[#11131a] border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col" style="box-shadow: 0 25px 60px -15px rgba(244,63,94,0.25);">
            
            <!-- Modal Header -->
            <div class="px-5 py-3.5 border-b border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
                        <i data-lucide="shield-check" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-base sm:text-lg font-black text-white tracking-tight">Panel Administrator</h2>
                            <span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Terautentikasi
                            </span>
                        </div>
                        <p class="text-xs text-white/60">MusifyStar StudioMusik &bull; Sesi Aktif</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="Profile.refreshAdminData()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer" title="Perbarui Data">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                    </button>
                    <button onclick="Profile.closeAdminModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer" title="Tutup">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Tab Switcher Navigation -->
            <div class="px-5 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0 overflow-x-auto hide-scrollbar">
                <div class="flex items-center gap-2">
                    <button id="admin-tab-btn-analytics" onclick="Profile.setAdminTab('analytics')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20 whitespace-nowrap">
                        <i data-lucide="activity" class="w-4 h-4"></i>
                        <span>Analitik Live</span>
                    </button>
                    <button id="admin-tab-btn-theme" onclick="Profile.setAdminTab('theme')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="palette" class="w-4 h-4"></i>
                        <span>Tema Musiman</span>
                    </button>
                    <button id="admin-tab-btn-broadcast" onclick="Profile.setAdminTab('broadcast')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="megaphone" class="w-4 h-4 text-amber-400"></i>
                        <span>Pengumuman Beranda</span>
                        <span id="admin-broadcast-status-badge" class="hidden text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse shadow-sm shadow-emerald-500/50">LIVE</span>
                    </button>
                    <button id="admin-tab-btn-version" onclick="Profile.setAdminTab('version')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="tag" class="w-4 h-4 text-sky-400"></i>
                        <span>Versi Aplikasi</span>
                        <span id="admin-version-tab-badge" class="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded-full font-mono font-bold">${Profile.appVersion || 'v1.0.0'}</span>
                    </button>
                    <button id="admin-tab-btn-feedback" onclick="Profile.setAdminTab('feedback')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="inbox" class="w-4 h-4"></i>
                        <span>Pesan Pengguna</span>
                        <span id="admin-feedback-badge" class="hidden text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">0</span>
                    </button>
                    <button id="admin-tab-btn-security" onclick="Profile.setAdminTab('security')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        <span>Keamanan & 2FA</span>
                    </button>
                    <button id="admin-tab-btn-users" onclick="Profile.setAdminTab('users')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="history" class="w-4 h-4 text-sky-400"></i>
                        <span>Log Login Pengguna</span>
                    </button>
                    <button id="admin-tab-btn-bans" onclick="Profile.setAdminTab('bans')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="shield-alert" class="w-4 h-4 text-rose-400"></i>
                        <span>Atur Sanksi & Ban</span>
                        <span id="admin-banned-count-badge" class="hidden text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">0</span>
                    </button>
                    <button id="admin-tab-btn-payment" onclick="Profile.setAdminTab('payment')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="qr-code" class="w-4 h-4 text-amber-400"></i>
                        <span>QRIS & Pembayaran</span>
                    </button>
                    <button id="admin-tab-btn-messages" onclick="Profile.setAdminTab('messages')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="send" class="w-4 h-4 text-emerald-400"></i>
                        <span>Pesan Pengguna (Direct)</span>
                    </button>
                    <button id="admin-tab-btn-siteupdate" onclick="Profile.setAdminTab('siteupdate')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap">
                        <i data-lucide="external-link" class="w-4 h-4 text-cyan-400"></i>
                        <span>Banner Update Link (Tengah Layar)</span>
                        <span id="admin-siteupdate-status-badge" class="hidden text-[9px] bg-cyan-400 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse shadow-sm shadow-cyan-400/50">LIVE</span>
                    </button>
                </div>

                <div id="admin-live-ticker" class="hidden sm:flex items-center gap-2 text-[11px] text-white/50 shrink-0">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Monitoring Real-Time Aktif</span>
                </div>
            </div>

            <!-- Views Container -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 hide-scrollbar">
                <!-- TAB 1: ANALYTICS VIEW -->
                <div id="admin-view-analytics" class="space-y-4">
                    <div class="text-center py-12 text-white/50 space-y-2">
                        <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-rose-400"></i>
                        <p class="text-xs">Memuat metrik analitik real-time...</p>
                    </div>
                </div>

                <!-- TAB 2: SEASONAL THEME SWITCHER -->
                <div id="admin-view-theme" class="hidden space-y-4">
                    <div id="admin-theme-container">
                        <!-- Populated by renderAdminThemeTab -->
                    </div>
                </div>

                <!-- TAB 3: BROADCAST NOTIFICATION / RUNNING TEXT -->
                <div id="admin-view-broadcast" class="hidden space-y-4">
                    <div id="admin-broadcast-container">
                        <!-- Populated by renderAdminBroadcastTab -->
                    </div>
                </div>

                <!-- TAB 4: APP VERSION MANAGEMENT -->
                <div id="admin-view-version" class="hidden space-y-4">
                    <div id="admin-version-container">
                        <!-- Populated by renderAdminVersionTab -->
                    </div>
                </div>

                <!-- TAB 5: FEEDBACK INBOX VIEW -->
                <div id="admin-view-feedback" class="hidden space-y-3">
                    <div id="admin-feedbacks-container" class="space-y-3">
                        <div class="text-center py-12 text-white/50 space-y-2">
                            <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-rose-400"></i>
                            <p class="text-xs">Mengambil data pesan masukan...</p>
                        </div>
                    </div>
                </div>

                <!-- TAB 6: SECURITY & 2FA VIEW -->
                <div id="admin-view-security" class="hidden space-y-4">
                    <div id="admin-security-container">
                        <!-- Populated by renderAdminSecurityTab -->
                    </div>
                </div>

                <!-- TAB 7: LOG LOGIN PENGGUNA VIEW -->
                <div id="admin-view-users" class="hidden space-y-4">
                    <div id="admin-users-container">
                        <!-- Populated by loadAdminUsersList -->
                    </div>
                </div>

                <!-- TAB 8: ATUR SANKSI & BLOKIR VIEW -->
                <div id="admin-view-bans" class="hidden space-y-4">
                    <div id="admin-bans-container">
                        <!-- Populated by loadAdminBansList -->
                    </div>
                </div>

                <!-- TAB 9: DYNAMIC QRIS & PAYMENT CONFIGURATOR -->
                <div id="admin-view-payment" class="hidden space-y-4">
                    <div id="admin-payment-container">
                        <!-- Populated by renderAdminPaymentTab -->
                    </div>
                </div>

                <!-- TAB 10: DIRECT USER MESSAGING (ADMIN TO USER) -->
                <div id="admin-view-messages" class="hidden space-y-4">
                    <div id="admin-messages-container">
                        <!-- Populated by renderAdminMessagesTab -->
                    </div>
                </div>

                <!-- TAB 11: SITE UPDATE LINK BANNER (TENGAH LAYAR) -->
                <div id="admin-view-siteupdate" class="hidden space-y-4">
                    <div id="admin-siteupdate-container">
                        <!-- Populated by renderAdminSiteUpdateTab -->
                    </div>
                </div>
            </div>

            <!-- Footer with Logout -->
            <div class="px-5 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
                <span class="text-white/40 text-[11px]">MusifyStar StudioMusik &bull; Server Engine v2.0</span>
                <button onclick="Profile.adminLogout()" class="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Keluar (Logout)
                </button>
            </div>
        </div>`;

        document.body.appendChild(modal);
        lucide.createIcons();

        // Setup auto-refresh ticker every 15 seconds
        if (Profile.adminRefreshInterval) clearInterval(Profile.adminRefreshInterval);
        Profile.adminRefreshInterval = setInterval(function() {
            if (gid('musifystar-admin-modal')) {
                Profile.refreshAdminData(true);
            } else {
                clearInterval(Profile.adminRefreshInterval);
            }
        }, 15000);

        // Load active tab
        Profile.setAdminTab(Profile.adminActiveTab || 'analytics');
    },

    setAdminTab(tab) {
        Profile.adminActiveTab = tab;
        var btnAnalytics = gid('admin-tab-btn-analytics');
        var btnTheme = gid('admin-tab-btn-theme');
        var btnBroadcast = gid('admin-tab-btn-broadcast');
        var btnVersion = gid('admin-tab-btn-version');
        var btnFeedback = gid('admin-tab-btn-feedback');
        var btnSecurity = gid('admin-tab-btn-security');
        var btnUsers = gid('admin-tab-btn-users');
        var btnBans = gid('admin-tab-btn-bans');
        var btnPayment = gid('admin-tab-btn-payment');
        var btnMessages = gid('admin-tab-btn-messages');
        var btnSiteUpdate = gid('admin-tab-btn-siteupdate');
        var viewAnalytics = gid('admin-view-analytics');
        var viewTheme = gid('admin-view-theme');
        var viewBroadcast = gid('admin-view-broadcast');
        var viewVersion = gid('admin-view-version');
        var viewFeedback = gid('admin-view-feedback');
        var viewSecurity = gid('admin-view-security');
        var viewUsers = gid('admin-view-users');
        var viewBans = gid('admin-view-bans');
        var viewPayment = gid('admin-view-payment');
        var viewMessages = gid('admin-view-messages');
        var viewSiteUpdate = gid('admin-view-siteupdate');

        var activeBtnClass = 'px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20 whitespace-nowrap';
        var inactiveBtnClass = 'px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70 hover:text-white whitespace-nowrap';

        if (btnAnalytics) btnAnalytics.className = tab === 'analytics' ? activeBtnClass : inactiveBtnClass;
        if (btnTheme) btnTheme.className = tab === 'theme' ? activeBtnClass : inactiveBtnClass;
        if (btnBroadcast) btnBroadcast.className = tab === 'broadcast' ? activeBtnClass : inactiveBtnClass;
        if (btnVersion) btnVersion.className = tab === 'version' ? activeBtnClass : inactiveBtnClass;
        if (btnFeedback) btnFeedback.className = tab === 'feedback' ? activeBtnClass : inactiveBtnClass;
        if (btnSecurity) btnSecurity.className = tab === 'security' ? activeBtnClass : inactiveBtnClass;
        if (btnUsers) btnUsers.className = tab === 'users' ? activeBtnClass : inactiveBtnClass;
        if (btnBans) btnBans.className = tab === 'bans' ? activeBtnClass : inactiveBtnClass;
        if (btnPayment) btnPayment.className = tab === 'payment' ? activeBtnClass : inactiveBtnClass;
        if (btnMessages) btnMessages.className = tab === 'messages' ? activeBtnClass : inactiveBtnClass;
        if (btnSiteUpdate) btnSiteUpdate.className = tab === 'siteupdate' ? activeBtnClass : inactiveBtnClass;

        if (viewAnalytics) viewAnalytics.classList.toggle('hidden', tab !== 'analytics');
        if (viewTheme) viewTheme.classList.toggle('hidden', tab !== 'theme');
        if (viewBroadcast) viewBroadcast.classList.toggle('hidden', tab !== 'broadcast');
        if (viewVersion) viewVersion.classList.toggle('hidden', tab !== 'version');
        if (viewFeedback) viewFeedback.classList.toggle('hidden', tab !== 'feedback');
        if (viewSecurity) viewSecurity.classList.toggle('hidden', tab !== 'security');
        if (viewUsers) viewUsers.classList.toggle('hidden', tab !== 'users');
        if (viewBans) viewBans.classList.toggle('hidden', tab !== 'bans');
        if (viewPayment) viewPayment.classList.toggle('hidden', tab !== 'payment');
        if (viewMessages) viewMessages.classList.toggle('hidden', tab !== 'messages');
        if (viewSiteUpdate) viewSiteUpdate.classList.toggle('hidden', tab !== 'siteupdate');

        if (tab === 'analytics') {
            Profile.loadAdminAnalytics();
        } else if (tab === 'theme') {
            Profile.renderAdminThemeTab();
        } else if (tab === 'broadcast') {
            Profile.renderAdminBroadcastTab();
        } else if (tab === 'version') {
            Profile.renderAdminVersionTab();
        } else if (tab === 'feedback') {
            Profile.loadAdminFeedbacks();
        } else if (tab === 'security') {
            Profile.renderAdminSecurityTab();
        } else if (tab === 'users') {
            Profile.loadAdminUsersList();
        } else if (tab === 'bans') {
            Profile.loadAdminBansList();
        } else if (tab === 'payment') {
            Profile.renderAdminPaymentTab();
        } else if (tab === 'messages') {
            Profile.renderAdminMessagesTab();
        } else if (tab === 'siteupdate') {
            Profile.renderAdminSiteUpdateTab();
        }
    },

    refreshAdminData(silent) {
        // Auto-refresh interval (silent) only updates live counters & badges without touching forms
        if (silent) {
            if (Profile.adminActiveTab === 'analytics') {
                Profile.loadAdminAnalytics(true);
            }
            Profile.checkFeedbackBadgeQuietly();
            if (typeof Profile.checkSiteUpdateBadgeQuietly === 'function') {
                Profile.checkSiteUpdateBadgeQuietly();
            }
            return;
        }

        // Manual user refresh button click
        if (Profile.adminActiveTab === 'feedback') {
            Profile.loadAdminFeedbacks();
        } else if (Profile.adminActiveTab === 'theme') {
            Profile.renderAdminThemeTab();
        } else if (Profile.adminActiveTab === 'broadcast') {
            Profile.renderAdminBroadcastTab();
        } else if (Profile.adminActiveTab === 'version') {
            Profile.renderAdminVersionTab();
        } else if (Profile.adminActiveTab === 'security') {
            Profile.renderAdminSecurityTab();
        } else if (Profile.adminActiveTab === 'users') {
            Profile.loadAdminUsersList();
        } else if (Profile.adminActiveTab === 'bans') {
            Profile.loadAdminBansList();
        } else if (Profile.adminActiveTab === 'payment') {
            Profile.renderAdminPaymentTab();
        } else if (Profile.adminActiveTab === 'messages') {
            Profile.renderAdminMessagesTab();
        } else if (Profile.adminActiveTab === 'siteupdate') {
            Profile.renderAdminSiteUpdateTab();
        } else {
            Profile.loadAdminAnalytics(false);
        }
    },

    async checkFeedbackBadgeQuietly() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/feedback', {
                headers: { 'x-admin-token': token }
            });
            var data = await res.json();
            if (data.status && Array.isArray(data.feedbacks)) {
                var badgeEl = gid('admin-feedback-badge');
                var unread = data.feedbacks.filter(function(f){ return !f.isRead; }).length;
                if (badgeEl) {
                    if (unread > 0) {
                        badgeEl.innerText = unread;
                        badgeEl.classList.remove('hidden');
                    } else {
                        badgeEl.classList.add('hidden');
                    }
                }
            }
        } catch(e) {}
    },

    // 1. ANALYTICS LOADER & RENDERER
    async loadAdminAnalytics(silent) {
        var container = gid('admin-view-analytics');
        var token = Profile.getAdminToken();
        if (!token) return;

        if (!silent && container && container.innerHTML.includes('loader-2')) {
            // keep loading state
        }

        try {
            var res = await fetch('/api/analytics', {
                headers: { 'x-admin-token': token }
            });
            var data = await res.json();

            if (!data.status) {
                if (container) {
                    var isAuthError = res.status === 401 || (data.message && data.message.toLowerCase().includes('token'));
                    if (isAuthError) {
                        sessionStorage.removeItem('musifystar_admin_token');
                        container.innerHTML = `
                        <div class="text-center py-10 px-4 text-white/80 space-y-4 max-w-sm mx-auto">
                            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                                <i data-lucide="shield-alert" class="w-6 h-6"></i>
                            </div>
                            <div class="space-y-1">
                                <h4 class="text-sm font-bold text-white">Sesi Login Admin Telah Berakhir</h4>
                                <p class="text-xs text-white/50 leading-relaxed">Sesi login Anda telah kedaluwarsa atau token tidak valid di server. Silakan masuk kembali menggunakan akun admin Anda.</p>
                            </div>
                            <button onclick="Profile.renderAdminLogin()" class="w-full py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-semibold rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2">
                                <i data-lucide="log-in" class="w-4 h-4"></i> Masuk / Login Admin Ulang
                            </button>
                        </div>`;
                    } else {
                        container.innerHTML = `
                        <div class="text-center py-12 text-red-400 space-y-2">
                            <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                            <p class="text-xs font-semibold">${data.message || 'Gagal mengambil analitik'}</p>
                        </div>`;
                    }
                    lucide.createIcons();
                }
                return;
            }

            var listeners = data.activeListeners || { count: 0, sessions: [] };
            var duration = data.listeningDuration || { totalSeconds: 0, totalMinutes: 0, totalHours: '0', totalSessions: 0, avgMinutesFormatted: '0 Menit', distribution: [] };
            var devices = data.deviceBreakdown || { totalDevices: 0, items: [] };
            var searches = data.searchAnalytics || { totalSearches: 0, topQueries: [] };
            var heatmap = data.listeningHeatmap || { totalPlays: 0, peakHour: '00:00', peakCount: 0, peakSegment: '-', hourly: [], segments: {} };

            // Render live currently playing track items
            var sessionsHtml = '';
            if (listeners.sessions && listeners.sessions.length > 0) {
                sessionsHtml = listeners.sessions.map(function(s) {
                    var devBadge = '';
                    if (s.device === 'android_apk') devBadge = '<span class="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">Aplikasi Android</span>';
                    else if (s.device === 'pwa_chrome') devBadge = '<span class="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">Aplikasi PWA</span>';
                    else if (s.device === 'safari_ios') devBadge = '<span class="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">Safari iOS</span>';
                    else devBadge = '<span class="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">Desktop Web</span>';

                    var u = s.user || {};
                    var isUserLoggedIn = Boolean(u.isLoggedIn && u.username && u.username !== 'Tamu (Belum Login)');
                    var displayUsername = isUserLoggedIn ? ('@' + u.username) : 'Pengguna Tamu';
                    var displayEmail = u.email ? `<span class="text-[10px] text-white/40 truncate block">${u.email}</span>` : '';
                    var userBadge = isUserLoggedIn 
                        ? '<span class="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-semibold shrink-0">Member</span>' 
                        : '<span class="text-[9px] bg-white/10 text-white/50 border border-white/15 px-1.5 py-0.2 rounded shrink-0">Tamu</span>';

                    var avatarUrl = u.avatar || (isUserLoggedIn 
                        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username)}` 
                        : '/logo.png');

                    var trackCover = s.image || (s.id ? `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg` : '/logo.png');
                    var listenDur = s.listeningSeconds ? (Math.floor(s.listeningSeconds / 60) + 'm ' + (s.listeningSeconds % 60) + 'd') : 'Baru saja';

                    return `
                    <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                        <!-- User Profile Information -->
                        <div class="flex items-center gap-3 min-w-0 sm:w-1/2">
                            <div class="relative shrink-0">
                                <img src="${avatarUrl}" class="w-10 h-10 rounded-full object-cover bg-black/40 border border-white/15 shadow-sm" onerror="this.src='/logo.png'" />
                                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#12141e] shadow-sm"></span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <h4 class="font-extrabold text-white text-xs truncate max-w-[160px]">${displayUsername}</h4>
                                    ${userBadge}
                                </div>
                                ${displayEmail}
                                <span class="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                                    <i data-lucide="clock" class="w-3 h-3 text-sky-400"></i> Durasi dengar: <strong class="text-white/80">${listenDur}</strong>
                                </span>
                            </div>
                        </div>

                        <!-- Song & Device Information -->
                        <div class="flex items-center justify-between sm:justify-end gap-3 min-w-0 sm:w-1/2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                <img src="${trackCover}" class="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0 shadow-sm" onerror="this.src='/logo.png'" />
                                <div class="min-w-0 flex-1">
                                    <p class="text-white font-bold text-xs truncate max-w-[200px]">${s.title || 'Sedang Mendengarkan'}</p>
                                    <div class="text-[11px] text-white/50 truncate flex items-center gap-1.5 mt-0.5">
                                        <span class="truncate">${s.artist || 'MusifyStar'}</span>
                                        ${devBadge}
                                    </div>
                                </div>
                            </div>

                            <span class="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full flex items-center gap-1.5 shrink-0 ml-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>Live</span>
                            </span>
                        </div>
                    </div>`;
                }).join('');
            } else {
                sessionsHtml = `
                <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/50 text-center space-y-1.5">
                    <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40">
                        <i data-lucide="headphones" class="w-5 h-5"></i>
                    </div>
                    <p class="font-bold text-white/70">Tidak ada lagu yang sedang diputar saat ini.</p>
                    <p class="text-[11px] text-white/40 max-w-md mx-auto">Saat Anda atau pengguna lain sedang memutar musik di aplikasi, profil username, foto, judul lagu, dan perangkatnya akan otomatis muncul di sini secara real-time.</p>
                </div>`;
            }

            // Render Duration Distribution Bars
            var durationBarsHtml = (duration.distribution || []).map(function(dist) {
                return `
                <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex-1 min-w-[100px] flex flex-col justify-between">
                    <div class="flex items-center justify-between text-[11px] mb-1.5">
                        <span class="text-white/60 font-medium">${dist.label}</span>
                        <span class="text-white font-bold">${dist.count} sesi</span>
                    </div>
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1">
                        <div class="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500" style="width: ${Math.max(4, dist.pct)}%;"></div>
                    </div>
                    <span class="text-[9px] text-white/40 truncate">${dist.desc}</span>
                </div>`;
            }).join('');

            // Render Device Breakdown Cards & Combined Bar
            var deviceCardsHtml = (devices.items || []).map(function(devItem) {
                return `
                <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl ${devItem.bg} flex items-center justify-center shrink-0">
                            <i data-lucide="${devItem.icon}" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-white">${devItem.label}</p>
                            <p class="text-[11px] text-white/50">${devItem.count} sesi pengguna</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-black text-white">${devItem.pct}%</span>
                    </div>
                </div>`;
            }).join('');

            // Proportional combined bar
            var deviceCombinedBarHtml = (devices.items || []).map(function(devItem) {
                var colors = {
                    android_apk: 'bg-emerald-500',
                    pwa_chrome: 'bg-amber-400',
                    safari_ios: 'bg-indigo-400',
                    desktop_web: 'bg-purple-500'
                };
                var w = devices.totalDevices > 0 ? devItem.pct : 25;
                return `<div class="${colors[devItem.key] || 'bg-white/20'} h-full transition-all duration-500" style="width: ${w}%;" title="${devItem.label}: ${devItem.pct}% (${devItem.count} sesi)"></div>`;
            }).join('');

            // Render 24-Hour Heatmap Bars
            var hourlyBarsHtml = '';
            var hasPlays = heatmap.totalPlays > 0;
            (heatmap.hourly || []).forEach(function(h) {
                var barHeight = hasPlays ? Math.max(4, h.pct) : 4;
                var isPeak = hasPlays && h.isPeak;
                var barGradient = isPeak 
                    ? 'bg-gradient-to-t from-rose-500 via-amber-400 to-yellow-300 shadow-lg shadow-rose-500/40 border border-amber-300/60'
                    : (hasPlays && h.pct > 65 
                        ? 'bg-gradient-to-t from-rose-600 to-purple-500 hover:brightness-125' 
                        : (hasPlays && h.pct > 30 
                            ? 'bg-gradient-to-t from-purple-700 to-indigo-500 hover:brightness-125' 
                            : 'bg-white/10 hover:bg-white/20'));

                hourlyBarsHtml += `
                <div class="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer" title="Jam ${h.label}: ${h.count} pemutaran (${hasPlays ? h.pct + '% dari puncak' : '0%'})">
                    <div class="absolute -top-10 scale-0 group-hover:scale-100 transition-all z-20 pointer-events-none bg-black/90 border border-white/20 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap shadow-xl">
                        ${h.label} &bull; ${h.count}x
                    </div>

                    <div class="h-3 flex items-center justify-center">
                        ${isPeak ? '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></span>' : ''}
                    </div>

                    <div class="w-full max-w-[18px] h-28 bg-white/5 rounded-t-md flex items-end justify-center p-0.5 relative overflow-hidden">
                        <div class="w-full rounded-t-sm transition-all duration-500 ${barGradient}" style="height: ${barHeight}%;"></div>
                    </div>

                    <span class="text-[9px] font-mono ${isPeak ? 'text-amber-300 font-black' : 'text-white/40'}">
                        ${(h.hour % 3 === 0 || h.hour === 23) ? String(h.hour).padStart(2, '0') : ''}
                    </span>
                </div>`;
            });

            // Render Top Search Queries
            var searchItemsHtml = '';
            var topList = searches.topQueries || [];
            if (topList.length > 0) {
                searchItemsHtml = topList.slice(0, 10).map(function(item) {
                    var rankBadge = '';
                    if (item.rank === 1) rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black flex items-center justify-center">1</span>';
                    else if (item.rank === 2) rankBadge = '<span class="w-5 h-5 rounded-full bg-slate-400/20 border border-slate-300/50 text-slate-200 text-[10px] font-black flex items-center justify-center">2</span>';
                    else if (item.rank === 3) rankBadge = '<span class="w-5 h-5 rounded-full bg-amber-700/20 border border-amber-600/50 text-amber-400 text-[10px] font-black flex items-center justify-center">3</span>';
                    else rankBadge = `<span class="w-5 h-5 rounded-full bg-white/5 text-white/50 text-[10px] font-semibold flex items-center justify-center">${item.rank}</span>`;

                    return `
                    <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2.5 flex-1 min-w-0">
                            ${rankBadge}
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-bold text-white truncate capitalize">${item.query}</span>
                                    <span class="text-[11px] text-white/60 font-semibold shrink-0 ml-2">${item.count}x dicari</span>
                                </div>
                                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" style="width: ${Math.min(100, Math.max(8, item.percentage))}%;"></div>
                                </div>
                            </div>
                        </div>

                        <button onclick="Profile.searchQueryInApp('${item.query.replace(/'/g, "\\'")}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 transition-all cursor-pointer shrink-0" title="Cari di Aplikasi">
                            <i data-lucide="search" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>`;
                }).join('');
            } else {
                searchItemsHtml = `
                <div class="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/50 col-span-full space-y-1">
                    <p class="font-medium text-white/70">Belum ada kata kunci pencarian yang terekam.</p>
                    <p class="text-[11px] text-white/40">Setiap pencarian lagu atau artis yang dilakukan di kolom pencarian aplikasi akan langsung terekam dan muncul di sini secara real-time.</p>
                </div>`;
            }

            var segs = heatmap.segments || {};
            var segDini = segs.diniHari || 0;
            var segPagi = segs.pagi || 0;
            var segSiang = segs.siangSore || 0;
            var segMalam = segs.malam || 0;

            var isListeningNow = listeners.count > 0;

            var html = `
            <!-- 1. REAL-TIME ACTIVE LISTENERS -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-rose-500/[0.04] border border-white/10 shadow-lg relative overflow-hidden">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div class="flex items-center gap-3.5">
                        <div class="relative flex items-center justify-center w-12 h-12 rounded-2xl ${isListeningNow ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'} border shrink-0">
                            ${isListeningNow ? '<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-30"></span>' : ''}
                            <i data-lucide="headphones" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                ${isListeningNow ? `
                                <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE AKTIF
                                </span>` : `
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/60 border border-white/15 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                                    <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span> STANDBY
                                </span>`}
                                <span class="text-[11px] text-white/50">Real-Time Active Listeners</span>
                            </div>
                            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 flex items-baseline gap-2">
                                <span>${listeners.count}</span>
                                <span class="text-xs font-semibold ${isListeningNow ? 'text-white/80' : 'text-white/50'}">${isListeningNow ? 'Pengguna Sedang Memutar Musik' : 'Pengguna Memutar Musik Saat Ini'}</span>
                            </h3>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="Profile.loadAdminAnalytics()" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Perbarui Live
                        </button>
                    </div>
                </div>

                <!-- Currently Streamed Tracks -->
                <div class="pt-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="radio" class="w-3.5 h-3.5 text-rose-400"></i> Lagu Yang Sedang Diputar Pengguna
                        </div>
                        <button onclick="Profile.clearActiveListeners()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Sesi Lagu Yang Sedang Diputar">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Sesi</span>
                        </button>
                    </div>
                    <div class="space-y-2">
                        ${sessionsHtml}
                    </div>
                </div>
            </div>

            <!-- 2. TOP 50 MOST PLAYED SONGS -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-rose-500/[0.04] border border-white/10 shadow-lg space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i data-lucide="flame" class="w-4 h-4 text-rose-500 fill-rose-500/20"></i>
                            <span>Top 50 Most Played Songs</span>
                        </h3>
                        <p class="text-xs text-white/60">Daftar lagu yang paling sering diputar dalam 24 jam, 7 hari, dan 30 hari terakhir</p>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="Profile.clearTopPlayedAnalytics()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Data Top Lagu">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Top Lagu</span>
                        </button>
                    </div>
                </div>

                <!-- Timeframe Selector & Search Filter -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div class="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                        <button id="top-played-btn-24h" onclick="Profile.setTopPlayedTimeframe('24h')" class="px-3 py-1.5 rounded-lg font-bold transition-all ${Profile.topPlayedTimeframe === '24h' ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow' : 'text-white/60 hover:text-white'}">
                            24 Jam Terakhir
                        </button>
                        <button id="top-played-btn-7d" onclick="Profile.setTopPlayedTimeframe('7d')" class="px-3 py-1.5 rounded-lg font-bold transition-all ${Profile.topPlayedTimeframe === '7d' ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow' : 'text-white/60 hover:text-white'}">
                            7 Hari Terakhir
                        </button>
                        <button id="top-played-btn-30d" onclick="Profile.setTopPlayedTimeframe('30d')" class="px-3 py-1.5 rounded-lg font-bold transition-all ${Profile.topPlayedTimeframe === '30d' ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow' : 'text-white/60 hover:text-white'}">
                            30 Hari Terakhir
                        </button>
                    </div>

                    <div class="relative min-w-[200px]">
                        <i data-lucide="search" class="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                        <input type="text" id="top-played-search-input" value="${Profile.topPlayedSearch || ''}" oninput="Profile.filterTopPlayed(this.value)" placeholder="Cari judul / artis..." class="w-full pl-8 pr-3 py-1.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors" />
                    </div>
                </div>

                <!-- Top 50 Song List -->
                <div id="admin-top-played-list-container" class="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                    <!-- Populated by renderTopPlayedList -->
                </div>
            </div>

            <!-- 3. AVERAGE LISTENING DURATION -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-indigo-500/[0.03] border border-white/10 shadow-lg space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i data-lucide="timer" class="w-4 h-4 text-sky-400"></i>
                            <span>Average Listening Duration</span>
                        </h3>
                        <p class="text-xs text-white/60">Statistik rata-rata durasi pengguna mendengarkan musik dalam satu sesi</p>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="Profile.clearDurationAnalytics()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Statistik Durasi Mendengarkan">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Durasi</span>
                        </button>
                        <div class="px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5">
                            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                            <span>${duration.avgMinutesFormatted} / Sesi</span>
                        </div>
                    </div>
                </div>

                <!-- 3 Top Metric Counters -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                            <i data-lucide="hourglass" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-[11px] text-white/50">Total Jam Pemutaran</p>
                            <h4 class="text-lg font-black text-white">${duration.totalHours} <span class="text-xs font-normal text-white/50">Jam</span></h4>
                        </div>
                    </div>

                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <i data-lucide="list-music" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-[11px] text-white/50">Total Sesi Terhitung</p>
                            <h4 class="text-lg font-black text-white">${duration.totalSessions} <span class="text-xs font-normal text-white/50">Sesi</span></h4>
                        </div>
                    </div>

                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <i data-lucide="play-circle" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-[11px] text-white/50">Total Menit Pemutaran</p>
                            <h4 class="text-lg font-black text-white">${duration.totalMinutes} <span class="text-xs font-normal text-white/50">Menit</span></h4>
                        </div>
                    </div>
                </div>

                <!-- Duration Distribution Brackets -->
                <div class="space-y-1.5 pt-1">
                    <span class="text-[11px] font-bold text-white/60 uppercase tracking-wider">Distribusi Rentang Durasi Sesi</span>
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        ${durationBarsHtml}
                    </div>
                </div>
            </div>

            <!-- 3. DEVICE & BROWSER BREAKDOWN -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-emerald-500/[0.03] border border-white/10 shadow-lg space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i data-lucide="laptop" class="w-4 h-4 text-emerald-400"></i>
                            <span>Device & Browser Breakdown</span>
                        </h3>
                        <p class="text-xs text-white/60">Grafik statistik platform & perangkat pengguna Aplikasi Android, Aplikasi Chrome, Safari iOS, Desktop Web</p>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="Profile.clearDeviceAnalytics()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Statistik Perangkat">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Device</span>
                        </button>
                        <div class="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            <span>${devices.totalDevices} Total Pengguna</span>
                        </div>
                    </div>
                </div>

                <!-- Combined Distribution Proportional Bar -->
                <div class="space-y-1.5">
                    <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
                        ${deviceCombinedBarHtml}
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-white/40 flex-wrap gap-2 pt-1">
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Aplikasi Android</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Aplikasi Chrome</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-indigo-400"></span> Safari iOS</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-purple-500"></span> Desktop Web</span>
                    </div>
                </div>

                <!-- 4 Device Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    ${deviceCardsHtml}
                </div>
            </div>

            <!-- 4. PEAK LISTENING HOURS HEATMAP -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i data-lucide="bar-chart-2" class="w-4 h-4 text-purple-400"></i>
                            <span>Peak Listening Hours Heatmap</span>
                        </h3>
                        <p class="text-xs text-white/60">Grafik jam sibuk kapan pengguna paling aktif mendengarkan musik (24 Jam Real-Time)</p>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="Profile.clearHeatmapAnalytics()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Grafik Peak Listening Hours Heatmap">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Heatmap</span>
                        </button>
                        <div class="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                            <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                            <span>Jam Puncak: ${hasPlays ? heatmap.peakHour + ' WIB' : 'Belum Ada Data'}</span>
                        </div>
                        <div class="px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                            <span>${heatmap.totalPlays}x Total Pemutaran</span>
                        </div>
                    </div>
                </div>

                <!-- 4 Time-of-Day Segments Pills -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div class="flex items-center gap-1.5 text-white/50 text-[11px] mb-1">
                            <i data-lucide="moon" class="w-3.5 h-3.5 text-indigo-400"></i> Dini Hari (00-04)
                        </div>
                        <p class="text-sm font-bold text-white">${segDini} <span class="text-[10px] text-white/50 font-normal">lagu</span></p>
                    </div>

                    <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div class="flex items-center gap-1.5 text-white/50 text-[11px] mb-1">
                            <i data-lucide="sunrise" class="w-3.5 h-3.5 text-amber-400"></i> Pagi (05-11)
                        </div>
                        <p class="text-sm font-bold text-white">${segPagi} <span class="text-[10px] text-white/50 font-normal">lagu</span></p>
                    </div>

                    <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div class="flex items-center gap-1.5 text-white/50 text-[11px] mb-1">
                            <i data-lucide="sun" class="w-3.5 h-3.5 text-orange-400"></i> Siang & Sore (12-17)
                        </div>
                        <p class="text-sm font-bold text-white">${segSiang} <span class="text-[10px] text-white/50 font-normal">lagu</span></p>
                    </div>

                    <div class="p-2.5 rounded-xl ${hasPlays && heatmap.peakSegment.includes('Malam') ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/[0.02] border-white/5'}">
                        <div class="flex items-center gap-1.5 text-white/50 text-[11px] mb-1">
                            <i data-lucide="sunset" class="w-3.5 h-3.5 text-rose-400"></i> Malam (18-23)
                        </div>
                        <p class="text-sm font-bold text-white">${segMalam} <span class="text-[10px] text-white/50 font-normal">lagu</span></p>
                    </div>
                </div>

                <!-- 24-Hour Heatmap Bars Chart -->
                <div class="bg-black/30 p-3 sm:p-4 rounded-2xl border border-white/5">
                    <div class="flex items-end gap-1 sm:gap-1.5 h-36 pt-4 pb-1">
                        ${hourlyBarsHtml}
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-white/40">
                        <span>00:00 Tengah Malam</span>
                        <span class="text-amber-400 font-bold flex items-center gap-1">
                            <i data-lucide="sparkles" class="w-3 h-3"></i> ${hasPlays ? 'Puncak Terpadat: ' + heatmap.peakSegment : 'Menunggu data pemutaran musik'}
                        </span>
                        <span>23:00 Larut Malam</span>
                    </div>
                </div>
            </div>

            <!-- 5. SEARCH QUERY ANALYTICS -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg space-y-3">
                <div class="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <i data-lucide="search" class="w-4 h-4 text-rose-400"></i>
                            <span>Search Query</span>
                        </h3>
                        <p class="text-xs text-white/60">Kata kunci musik & artis yang dicari langsung oleh pengguna di kolom pencarian aplikasi (100% Real-Time)</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="Profile.clearSearchAnalytics()" class="text-[11px] bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95" title="Reset Search Query Analytics">
                            <i data-lucide="trash-2" class="w-3 h-3 text-rose-400"></i>
                            <span>Reset Pencarian</span>
                        </button>
                        <span class="text-[11px] bg-white/10 text-white/80 px-2.5 py-1 rounded-xl font-bold border border-white/10">
                            ${searches.totalSearches} Total Pencarian
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    ${searchItemsHtml}
                </div>
            </div>`;

            if (container) {
                container.innerHTML = html;
                Profile.renderTopPlayedList();
                lucide.createIcons();
            }
        } catch (err) {
            if (container) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="wifi-off" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">Kesalahan saat memuat analitik server.</p>
                </div>`;
                lucide.createIcons();
            }
        }
    },

    // TOP 50 MOST PLAYED SONGS LOGIC & RENDERER
    topPlayedTimeframe: '24h',
    topPlayedSearch: '',

    setTopPlayedTimeframe(tf) {
        Profile.topPlayedTimeframe = tf;
        ['24h', '7d', '30d'].forEach(function(k) {
            var btn = gid('top-played-btn-' + k);
            if (btn) {
                if (k === tf) {
                    btn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-lg font-bold transition-all text-white/60 hover:text-white';
                }
            }
        });
        Profile.renderTopPlayedList();
    },

    filterTopPlayed(val) {
        Profile.topPlayedSearch = (val || '').toLowerCase().trim();
        Profile.renderTopPlayedList();
    },

    renderTopPlayedList() {
        var container = gid('admin-top-played-list-container');
        if (!container) return;

        var analytics = Profile.adminAnalyticsData || {};
        var topData = analytics.topPlayed || {};
        var tfData = topData[Profile.topPlayedTimeframe || '24h'] || { totalPlays: 0, songs: [] };
        var songs = tfData.songs || [];

        if (Profile.topPlayedSearch) {
            var q = Profile.topPlayedSearch;
            songs = songs.filter(function(s) {
                return (s.title && s.title.toLowerCase().includes(q)) || (s.artist && s.artist.toLowerCase().includes(q));
            });
        }

        if (songs.length === 0) {
            container.innerHTML = `
            <div class="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/50 space-y-1.5">
                <i data-lucide="music" class="w-6 h-6 mx-auto text-white/30"></i>
                <p class="font-medium text-white/70">${Profile.topPlayedSearch ? 'Tidak ada lagu yang cocok dengan pencarian.' : 'Belum ada data pemutaran lagu pada periode ini.'}</p>
                <p class="text-[11px] text-white/40">Saat pengguna mendengarkan musik, 50 lagu teratas akan diperingkatkan otomatis di sini.</p>
            </div>`;
            lucide.createIcons();
            return;
        }

        var maxCount = songs[0] ? (songs[0].count || 1) : 1;
        var html = songs.map(function(song, index) {
            var rank = index + 1;
            var rankBadge = '';
            if (rank === 1) {
                rankBadge = '<span class="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center shadow-md shadow-amber-400/30 shrink-0">1</span>';
            } else if (rank === 2) {
                rankBadge = '<span class="w-6 h-6 rounded-lg bg-slate-300 text-black text-xs font-black flex items-center justify-center shadow-md shadow-slate-300/30 shrink-0">2</span>';
            } else if (rank === 3) {
                rankBadge = '<span class="w-6 h-6 rounded-lg bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-md shadow-amber-700/30 shrink-0">3</span>';
            } else {
                rankBadge = `<span class="w-6 h-6 rounded-lg bg-white/5 text-white/60 text-xs font-bold flex items-center justify-center shrink-0">${rank}</span>`;
            }

            var coverImg = song.image ? `<img src="${song.image}" class="w-8 h-8 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0" onerror="this.src='/logo.png'" />` : `<div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shrink-0"><i data-lucide="disc" class="w-4 h-4"></i></div>`;

            var pct = Math.round((song.count / maxCount) * 100);
            var safeTitle = (song.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            var safeArtist = (song.artist || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            var safeImage = (song.image || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            var safeId = (song.id || '').replace(/'/g, "\\'");

            return `
            <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3 group">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    ${rankBadge}
                    ${coverImg}
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">${song.title || 'Lagu Tanpa Judul'}</span>
                            <span class="text-[11px] text-rose-300 font-bold shrink-0 ml-2">${song.count}x putar</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-white/50 truncate flex-1">${song.artist || 'MusifyStar'}</span>
                            <div class="w-20 sm:w-28 bg-white/5 h-1.5 rounded-full overflow-hidden shrink-0">
                                <div class="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" style="width: ${Math.max(8, pct)}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="Profile.playAdminTrack('${safeId}', '${safeTitle}', '${safeArtist}', '${safeImage}')" class="p-2 rounded-xl bg-white/5 hover:bg-rose-500 text-white/70 hover:text-white transition-all active:scale-90 cursor-pointer shadow" title="Putar Lagu Ini">
                        <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        container.innerHTML = html;
        lucide.createIcons();
    },

    playAdminTrack(id, title, artist, image) {
        if (id && typeof S !== 'undefined') {
            S.ct = {
                id: id,
                videoId: id,
                title: title,
                artist: artist,
                cover: image || '/logo.png',
                artistId: '',
                ytUrl: 'https://youtube.com/watch?v=' + id
            };
            S.ps = 'direct';
            S.pl = [S.ct];
            S.pi = 0;
            if (typeof UU === 'function') UU();
            if (typeof MP !== 'undefined' && MP.show) MP.show();
            if (typeof resetLyricsUI === 'function') resetLyricsUI(id);
            if (typeof FullPlayer !== 'undefined' && FullPlayer.open) FullPlayer.open();
            if (typeof loadTrack === 'function') loadTrack(S.ct);
            if (typeof showToast === 'function') showToast('Memutar: ' + title);
        } else {
            Profile.closeAdminModal();
            if (window.Search && typeof Search.query === 'function') {
                Search.query(title + ' ' + artist);
            }
        }
    },

    // Kosongkan riwayat Top 50 Most Played Songs
    async clearTopPlayedAnalytics() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_top_played', timeframe: Profile.topPlayedTimeframe || '24h' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Data Top 50 Lagu berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // Aksi untuk langsung mencari query terpopuler di aplikasi
    searchQueryInApp(query) {
        Profile.closeAdminModal();
        if (window.Search && typeof Search.query === 'function') {
            Search.query(query);
        } else if (window.App && typeof App.switch === 'function') {
            App.switch('search');
            var searchInput = gid('search-input');
            if (searchInput) {
                searchInput.value = query;
                var sf = gid('search-form');
                if (sf) sf.dispatchEvent(new Event('submit'));
            }
        }
    },

    // Kosongkan riwayat durasi mendengarkan
    async clearDurationAnalytics() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_duration' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Statistik durasi mendengarkan berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // Kosongkan statistik perangkat
    async clearDeviceAnalytics() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_devices' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Statistik perangkat & browser berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // Kosongkan riwayat lagu yang sedang diputar (Active Listeners)
    async clearActiveListeners() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_listeners' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Sesi pendengar aktif berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // Kosongkan riwayat pencarian murni
    async clearSearchAnalytics() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_searches' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Riwayat pencarian berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // Kosongkan riwayat Peak Listening Hours Heatmap
    async clearHeatmapAnalytics() {
        var token = Profile.getAdminToken();
        if (!token) return;
        try {
            var res = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: 'clear_heatmap' })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Grafik Heatmap pemutaran berhasil direset');
                }
                Profile.loadAdminAnalytics(false);
            }
        } catch (e) {}
    },

    // ==========================================
    // 2. TAB SEASONAL THEME SWITCHER
    // ==========================================
    async renderAdminThemeTab() {
        var container = gid('admin-theme-container');
        if (!container) return;

        try {
            var res = await fetch('/api/theme');
            var data = await res.json();
            var activeTheme = data.activeTheme || 'default';
            var availableThemes = data.availableThemes || [];
            var showBanner = data.showBanner !== false;
            var customGreeting = data.customGreeting || '';

            var themesHtml = availableThemes.map(function(t) {
                var isActive = t.id === activeTheme;
                return `
                <div onclick="Profile.selectThemeCard('${t.id}')" class="p-4 rounded-2xl border transition-all cursor-pointer relative group ${isActive ? 'bg-gradient-to-br from-rose-500/15 via-purple-500/10 to-transparent border-rose-500/50 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/40' : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'}">
                    <div class="flex items-start gap-3.5">
                        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border" style="background: ${t.glowColor || 'rgba(255,255,255,0.08)'}; color: ${t.accentColor || '#fff'}; border-color: ${t.accentColor || '#fff'}40;">
                            <i data-lucide="${t.icon || 'sparkles'}" class="w-5 h-5"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2 mb-1">
                                <h4 class="text-sm font-bold text-white flex items-center gap-2">
                                    <span>${t.name}</span>
                                    ${isActive ? '<span class="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Aktif</span>' : ''}
                                </h4>
                                <input type="radio" name="admin-selected-theme" value="${t.id}" ${isActive ? 'checked' : ''} class="w-4 h-4 text-rose-500 focus:ring-rose-500 bg-black/40 border-white/20 accent-rose-500 cursor-pointer" />
                            </div>
                            <p class="text-xs text-white/60 line-clamp-2 leading-relaxed">${t.subtitle || t.description || ''}</p>
                            <div class="mt-2.5 flex items-center gap-2">
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md border" style="background: ${t.glowColor || 'rgba(255,255,255,0.05)'}; color: ${t.accentColor || '#fff'}; border-color: ${t.accentColor || '#fff'}30;">
                                    ${t.badgeText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');

            container.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-5">
                <!-- Header Card -->
                <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 shadow-lg">
                    <div class="flex items-center gap-3.5 mb-2">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                            <i data-lucide="palette" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-white">Seasonal Theme Switcher</h3>
                            <p class="text-xs text-white/60">Aktifkan tema visual berkala (Puasa, Lebaran, Tahun Baru, Idul Adha) secara instan</p>
                        </div>
                    </div>
                    <div class="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-white/70 leading-relaxed flex items-start gap-2">
                        <i data-lucide="info" class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"></i>
                        <span>Tema yang diaktifkan akan langsung diterapkan ke seluruh pengguna aplikasi, lengkap dengan palet warna suasana dan banner ucapan khusus di Beranda.</span>
                    </div>
                </div>

                <!-- Theme Selection Cards Grid -->
                <div class="space-y-3">
                    <span class="text-xs font-bold text-white/80 uppercase tracking-wider block">Pilih Tema Yang Ingin Diaktifkan</span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${themesHtml}
                    </div>
                </div>

                <!-- Custom Options Form -->
                <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-lg">
                    <span class="text-xs font-bold text-white/80 uppercase tracking-wider block">Pengaturan Tambahan</span>

                    <label class="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" id="admin-theme-show-banner" ${showBanner ? 'checked' : ''} class="w-4 h-4 rounded text-rose-500 bg-black/40 border-white/20 accent-rose-500 cursor-pointer" />
                        <div>
                            <p class="text-xs font-bold text-white">Tampilkan Banner Ucapan Musiman</p>
                            <p class="text-[11px] text-white/50">Menampilkan kartu banner interaktif di halaman beranda atas</p>
                        </div>
                    </label>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80">Kustomisasi Pesan / Ucapan (Opsional)</label>
                        <input type="text" id="admin-theme-custom-greeting" value="${customGreeting}" placeholder="Kosongkan untuk menggunakan ucapan default tema" class="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-all font-sans" />
                    </div>

                    <button type="button" onclick="Profile.saveSeasonalTheme()" id="admin-save-theme-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 active:scale-98 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        <span>Terapkan & Simpan Tema Sekarang</span>
                    </button>
                </div>
            </div>`;

            lucide.createIcons();
        } catch (e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="wifi-off" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Gagal memuat konfigurasi tema musiman.</p>
            </div>`;
            lucide.createIcons();
        }
    },

    selectThemeCard(themeId) {
        var radio = document.querySelector(`input[name="admin-selected-theme"][value="${themeId}"]`);
        if (radio) radio.checked = true;
    },

    async saveSeasonalTheme() {
        var token = Profile.getAdminToken();
        if (!token) return;

        var selectedRadio = document.querySelector('input[name="admin-selected-theme"]:checked');
        var themeId = selectedRadio ? selectedRadio.value : 'default';
        var showBanner = gid('admin-theme-show-banner') ? gid('admin-theme-show-banner').checked : true;
        var customGreeting = gid('admin-theme-custom-greeting') ? gid('admin-theme-custom-greeting').value.trim() : '';
        var btn = gid('admin-save-theme-btn');

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menerapkan Tema...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    activeTheme: themeId,
                    showBanner: showBanner,
                    customGreeting: customGreeting
                })
            });
            var data = await res.json();
            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Tema musiman berhasil diubah: ' + (data.themeDetails ? data.themeDetails.name : themeId));
                }
                if (window.App && typeof App.applySeasonalTheme === 'function') {
                    App.applySeasonalTheme(data);
                }
                Profile.renderAdminThemeTab();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal menyimpan tema.');
                }
            }
        } catch (e) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan jaringan saat menyimpan tema.');
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> <span>Terapkan & Simpan Tema Sekarang</span>';
                lucide.createIcons();
            }
        }
    },

    // ==========================================
    // 3. TAB BROADCAST NOTIFICATION & ANNOUNCEMENT BANNER
    // ==========================================
    broadcastPresets: [],

    async renderAdminBroadcastTab(silent) {
        var container = gid('admin-broadcast-container');
        if (!container) return;

        var token = Profile.getAdminToken();
        if (!token) return;

        if (!silent) {
            container.innerHTML = `
            <div class="text-center py-12 text-white/50 space-y-2">
                <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-amber-400"></i>
                <p class="text-xs">Memuat konfigurasi pengumuman beranda...</p>
            </div>`;
            if (window.lucide) lucide.createIcons();
        }

        try {
            var res = await fetch('/api/broadcast');
            var data = await res.json();

            var enabled = !!data.enabled;
            var title = data.title || '';
            var text = data.text || '';
            var badge = data.badge || 'PENGUMUMAN';
            var type = data.type || 'info';
            var icon = data.icon || 'megaphone';
            var closable = data.closable !== false;
            var presets = data.presets || [];
            Profile.broadcastPresets = presets;

            // Update live badge in header
            var statusBadge = gid('admin-broadcast-status-badge');
            if (statusBadge) {
                if (enabled) {
                    statusBadge.classList.remove('hidden');
                } else {
                    statusBadge.classList.add('hidden');
                }
            }

            var presetsHtml = presets.map(function(p) {
                return `
                <button type="button" onclick="Profile.applyBroadcastPreset('${p.id}')" class="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between">
                    <div class="flex items-center justify-between gap-2 mb-1 w-full">
                        <span class="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5 truncate">
                            <i data-lucide="${p.icon || 'sparkles'}" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
                            <span class="truncate">${p.name}</span>
                        </span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold shrink-0 border border-amber-500/20">Preset</span>
                    </div>
                    <p class="text-[11px] text-white/50 line-clamp-1 leading-snug">${p.text}</p>
                </button>`;
            }).join('');

            container.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-5">
                <!-- Header Info Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-purple-500/10 border border-amber-500/20 shadow-lg relative overflow-hidden">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                                <i data-lucide="megaphone" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">Pengumuman Beranda</h3>
                                <p class="text-xs text-white/60">Kelola pesan dan kartu pengumuman langsung di halaman utama</p>
                            </div>
                        </div>
                        <div class="shrink-0 flex items-center gap-2">
                            ${enabled ? `
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>Aktif di Beranda</span>
                                </div>` : `
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/50 border border-white/10">
                                    <span class="w-2 h-2 rounded-full bg-white/30"></span>
                                    <span>Nonaktif</span>
                                </div>`
                            }
                        </div>
                    </div>
                </div>

                <!-- Live Preview Simulator Box -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="eye" class="w-3.5 h-3.5 text-amber-400"></i>
                            <span>Pratinjau Tampilan</span>
                        </span>
                        <span class="text-[10px] text-white/40">Otomatis Diperbarui</span>
                    </div>
                    
                    <!-- Preview Container -->
                    <div id="admin-broadcast-preview-box" class="transition-all">
                        <!-- Populated by updateBroadcastLivePreview -->
                    </div>
                </div>

                <!-- Quick Presets Grid -->
                <div class="space-y-2">
                    <span class="text-xs font-bold text-white/70 uppercase tracking-wider block">Template Pengumuman Cepat</span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${presetsHtml}
                    </div>
                </div>

                <!-- Broadcast Configuration Form -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-lg">
                    <div class="flex items-center justify-between pb-3 border-b border-white/10">
                        <span class="text-xs font-bold text-white uppercase tracking-wider">Detail Pengumuman</span>
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" id="admin-broadcast-enabled" ${enabled ? 'checked' : ''} onchange="Profile.updateBroadcastLivePreview()" class="w-4 h-4 rounded text-amber-500 bg-black/40 border-white/20 accent-amber-500 cursor-pointer" />
                            <span class="text-xs font-bold text-amber-300">Aktifkan Banner</span>
                        </label>
                    </div>

                    <!-- Title Input -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-medium text-white/80">Judul Pengumuman</label>
                        <input type="text" id="admin-broadcast-title" value="${es(title)}" oninput="Profile.updateBroadcastLivePreview()" placeholder="Contoh: Selamat Datang di MusifyStar / Info Pembaruan" class="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all font-medium" />
                    </div>

                    <!-- Text Input -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-medium text-white/80">Isi Pesan</label>
                            <span id="admin-broadcast-char-count" class="text-[10px] text-white/40 font-mono">0 Karakter</span>
                        </div>
                        <textarea id="admin-broadcast-text" rows="3" oninput="Profile.updateBroadcastLivePreview()" placeholder="Tulis isi pengumuman yang ingin disampaikan..." class="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all leading-relaxed">${es(text)}</textarea>
                    </div>

                    <!-- Badge Input -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-medium text-white/80">Label Lencana (Badge)</label>
                        <input type="text" id="admin-broadcast-badge" value="${es(badge)}" oninput="Profile.updateBroadcastLivePreview()" placeholder="Contoh: PENGUMUMAN, RAMADHAN, INFO" class="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-all font-medium uppercase" />
                    </div>

                    <!-- Clean 2-Column Selectors for Icon & Color Mood -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                        <div class="space-y-1.5">
                            <label class="text-xs font-medium text-white/80 flex items-center gap-1.5">
                                <i data-lucide="smile" class="w-3.5 h-3.5 text-amber-400"></i>
                                <span>Ikon Kartu</span>
                            </label>
                            <select id="admin-broadcast-icon" onchange="Profile.updateBroadcastLivePreview()" class="w-full bg-black/60 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer">
                                <option value="megaphone" ${icon === 'megaphone' ? 'selected' : ''}>Pengumuman Megaphone</option>
                                <option value="moon" ${icon === 'moon' ? 'selected' : ''}>Ramadhan Bulan Moon</option>
                                <option value="sparkles" ${icon === 'sparkles' ? 'selected' : ''}>Rilis Baru Sparkles</option>
                                <option value="wrench" ${icon === 'wrench' ? 'selected' : ''}>Pemeliharaan Wrench</option>
                                <option value="alert-triangle" ${icon === 'alert-triangle' ? 'selected' : ''}>Peringatan Alert</option>
                                <option value="bell" ${icon === 'bell' ? 'selected' : ''}>Notifikasi Bell</option>
                                <option value="zap" ${icon === 'zap' ? 'selected' : ''}>Promo Kilat Zap</option>
                                <option value="flame" ${icon === 'flame' ? 'selected' : ''}>Trending Flame</option>
                                <option value="music" ${icon === 'music' ? 'selected' : ''}>Musik Music</option>
                                <option value="party-popper" ${icon === 'party-popper' ? 'selected' : ''}>Perayaan Party</option>
                                <option value="heart" ${icon === 'heart' ? 'selected' : ''}>Favorit Heart</option>
                                <option value="info" ${icon === 'info' ? 'selected' : ''}>Info Information</option>
                            </select>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-medium text-white/80 flex items-center gap-1.5">
                                <i data-lucide="palette" class="w-3.5 h-3.5 text-amber-400"></i>
                                <span>Warna & Suasana Tema</span>
                            </label>
                            <select id="admin-broadcast-type" onchange="Profile.updateBroadcastLivePreview()" class="w-full bg-black/60 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer">
                                <option value="info" ${type === 'info' ? 'selected' : ''}>Indigo Midnight Biru/Ungu Netral</option>
                                <option value="update" ${type === 'update' ? 'selected' : ''}>Emerald Jade Hijau Ramadhan</option>
                                <option value="maintenance" ${type === 'maintenance' ? 'selected' : ''}>Golden Amber Emas Pemeliharaan</option>
                                <option value="warning" ${type === 'warning' ? 'selected' : ''}>Ruby Rose Merah Penting & Urgent</option>
                                <option value="custom" ${type === 'custom' ? 'selected' : ''}>Cyber Fuchsia Neon Spesial</option>
                            </select>
                        </div>
                    </div>

                    <!-- Closable Option -->
                    <div class="pt-2 border-t border-white/5">
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" id="admin-broadcast-closable" ${closable ? 'checked' : ''} onchange="Profile.updateBroadcastLivePreview()" class="w-4 h-4 rounded text-amber-500 bg-black/40 border-white/20 accent-amber-500 cursor-pointer" />
                            <span class="text-xs text-white/70">Izinkan pengguna menutup kartu (Tombol ×)</span>
                        </label>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-2.5">
                    <button id="admin-save-broadcast-btn" onclick="Profile.saveBroadcastConfig(true)" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        <span>Terapkan & Simpan Pengumuman</span>
                    </button>
                    ${enabled ? `
                    <button onclick="Profile.saveBroadcastConfig(false)" class="py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer">
                        <i data-lucide="power" class="w-4 h-4"></i>
                        <span>Matikan Pengumuman</span>
                    </button>` : ''}
                </div>
            </div>`;

            if (window.lucide) lucide.createIcons();
            Profile.updateBroadcastLivePreview();

        } catch (e) {
            if (container) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">Gagal memuat konfigurasi broadcast pengumuman.</p>
                </div>`;
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    // Real-time Preview update for Admin Broadcast panel
    updateBroadcastLivePreview() {
        var previewBox = gid('admin-broadcast-preview-box');
        if (!previewBox) return;

        var titleEl = gid('admin-broadcast-title');
        var textEl = gid('admin-broadcast-text');
        var badgeEl = gid('admin-broadcast-badge');
        var typeEl = gid('admin-broadcast-type');
        var iconEl = gid('admin-broadcast-icon');
        var closableEl = gid('admin-broadcast-closable');
        var enabledEl = gid('admin-broadcast-enabled');
        var charCountEl = gid('admin-broadcast-char-count');

        var title = titleEl ? titleEl.value.trim() : '';
        var text = textEl ? textEl.value.trim() : '';
        var badge = badgeEl && badgeEl.value.trim() ? badgeEl.value.trim().toUpperCase() : 'PENGUMUMAN';
        var type = typeEl ? typeEl.value : 'info';
        var icon = iconEl ? iconEl.value : 'megaphone';
        var closable = closableEl ? closableEl.checked : true;
        var enabled = enabledEl ? enabledEl.checked : true;

        if (charCountEl) {
            charCountEl.innerText = text.length + ' Karakter';
        }

        var previewTitle = title || badge;
        var previewText = text || 'Teks pengumuman akan ditampilkan di sini dengan rapi dan jelas kepada seluruh pengguna...';

        // Color palettes
        var glowColor = 'rgba(99, 102, 241, 0.25)';
        var accentColor = '#818cf8';
        var borderColor = 'rgba(99, 102, 241, 0.35)';

        if (type === 'maintenance') {
            glowColor = 'rgba(245, 158, 11, 0.25)';
            accentColor = '#f59e0b';
            borderColor = 'rgba(245, 158, 11, 0.4)';
        } else if (type === 'warning') {
            glowColor = 'rgba(244, 63, 94, 0.25)';
            accentColor = '#f43f5e';
            borderColor = 'rgba(244, 63, 94, 0.4)';
        } else if (type === 'update') {
            glowColor = 'rgba(16, 185, 129, 0.25)';
            accentColor = '#10b981';
            borderColor = 'rgba(16, 185, 129, 0.4)';
        } else if (type === 'custom') {
            glowColor = 'rgba(168, 85, 247, 0.25)';
            accentColor = '#c084fc';
            borderColor = 'rgba(168, 85, 247, 0.4)';
        }

        var closeBtnCard = closable ? `
        <span class="p-1 rounded-lg bg-white/5 text-white/50 shrink-0 cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
        </span>` : '';

        // Home Announcement Card preview (matches home screen card)
        var cardHtml = `
        <div class="p-4 sm:p-5 rounded-2xl border transition-all duration-500 overflow-hidden relative shadow-xl ${!enabled ? 'opacity-40 grayscale' : ''}" style="background: radial-gradient(circle at 80% 20%, ${glowColor} 0%, rgba(20, 24, 33, 0.95) 85%); border-color: ${borderColor}; box-shadow: 0 12px 36px -10px ${glowColor};">
            <div class="flex items-start gap-3.5 relative z-10">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg" style="background: ${glowColor}; color: ${accentColor}; border-color: ${borderColor};">
                    <i data-lucide="${icon}" class="w-6 h-6 animate-pulse"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 shadow-sm" style="background: ${accentColor}25; color: ${accentColor}; border-color: ${accentColor}50;">
                            ${badge}
                        </span>
                        ${closeBtnCard}
                    </div>
                    <h3 class="text-sm sm:text-base font-black text-white tracking-tight">${previewTitle}</h3>
                    <p class="text-xs text-white/80 mt-1 leading-relaxed font-sans">${previewText}</p>
                </div>
            </div>
        </div>`;

        previewBox.innerHTML = cardHtml;
        if (window.lucide) lucide.createIcons();
    },

    // Apply quick preset to form
    applyBroadcastPreset(presetId) {
        var preset = (Profile.broadcastPresets || []).find(function(p) { return p.id === presetId; });
        if (!preset) return;

        var titleEl = gid('admin-broadcast-title');
        var textEl = gid('admin-broadcast-text');
        var badgeEl = gid('admin-broadcast-badge');
        var enabledEl = gid('admin-broadcast-enabled');
        var iconEl = gid('admin-broadcast-icon');
        var typeEl = gid('admin-broadcast-type');

        if (titleEl) titleEl.value = preset.title || '';
        if (textEl) textEl.value = preset.text || '';
        if (badgeEl) badgeEl.value = preset.badge || 'PENGUMUMAN';
        if (enabledEl) enabledEl.checked = true;
        if (iconEl && preset.icon) iconEl.value = preset.icon;
        if (typeEl && preset.type) typeEl.value = preset.type;

        Profile.updateBroadcastLivePreview();

        if (typeof showToast === 'function') {
            showToast('Template "' + preset.name + '" diterapkan');
        }
    },

    // Save & broadcast to all clients
    async saveBroadcastConfig(overrideEnabled) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin berakhir, silakan login kembali.');
            return;
        }

        var titleEl = gid('admin-broadcast-title');
        var textEl = gid('admin-broadcast-text');
        var badgeEl = gid('admin-broadcast-badge');
        var typeEl = gid('admin-broadcast-type');
        var iconEl = gid('admin-broadcast-icon');
        var closableEl = gid('admin-broadcast-closable');
        var enabledEl = gid('admin-broadcast-enabled');

        var enabled = overrideEnabled !== undefined ? overrideEnabled : (enabledEl ? enabledEl.checked : true);
        var title = titleEl ? titleEl.value.trim() : '';
        var text = textEl ? textEl.value.trim() : '';
        var badge = badgeEl && badgeEl.value.trim() ? badgeEl.value.trim().toUpperCase() : 'PENGUMUMAN';
        var type = typeEl ? typeEl.value : (Profile.selectedBroadcastType || 'info');
        var icon = iconEl ? iconEl.value : (Profile.selectedBroadcastIcon || 'megaphone');
        var closable = closableEl ? closableEl.checked : true;

        if (enabled && !text) {
            if (typeof showToast === 'function') showToast('Harap masukkan isi pesan pengumuman sebelum menyiarkan.');
            if (textEl) textEl.focus();
            return;
        }

        var btn = gid('admin-save-broadcast-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menyiarkan...</span>';
            if (window.lucide) lucide.createIcons();
        }

        try {
            var res = await fetch('/api/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    enabled: enabled,
                    title: title,
                    text: text,
                    badge: badge,
                    type: type,
                    icon: icon,
                    closable: closable
                })
            });

            var data = await res.json();
            if (data.status) {
                sessionStorage.removeItem('musifystar_dismissed_broadcast');
                if (typeof showToast === 'function') {
                    showToast(enabled ? 'Pengumuman berhasil disiarkan ke Beranda!' : 'Pengumuman dinonaktifkan.');
                }
                if (window.App && typeof App.applyBroadcast === 'function') {
                    App.applyBroadcast(data.config);
                }
                Profile.renderAdminBroadcastTab();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal menyimpan pengumuman');
                }
            }
        } catch (e) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan jaringan saat menyimpan pengumuman');
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> <span>Terapkan & Siarkan Pengumuman Sekarang</span>';
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    // ==========================================
    // TAB: SITE UPDATE LINK BANNER (TENGAH LAYAR)
    // ==========================================
    async checkSiteUpdateBadgeQuietly() {
        try {
            var res = await fetch('/api/site-update?t=' + Date.now(), { cache: 'no-store' });
            var data = await res.json();
            var badgeEl = gid('admin-siteupdate-status-badge');
            if (badgeEl) {
                if (data && data.status && data.enabled && data.targetUrl) {
                    badgeEl.classList.remove('hidden');
                } else {
                    badgeEl.classList.add('hidden');
                }
            }
        } catch (e) {}
    },

    async renderAdminSiteUpdateTab() {
        var container = gid('admin-siteupdate-container');
        if (!container) return;

        container.innerHTML = `
        <div class="text-center py-12 text-white/50 space-y-2">
            <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto text-cyan-400"></i>
            <p class="text-xs">Memuat konfigurasi banner update link website...</p>
        </div>`;
        if (window.lucide) lucide.createIcons();

        try {
            var res = await fetch('/api/site-update?t=' + Date.now(), { cache: 'no-store' });
            var data = await res.json();
            var config = (data && data.status) ? data : {
                enabled: false,
                title: 'Pembaruan Website MusifyStar',
                message: 'Website MusifyStar telah berpindah ke alamat tautan (link) baru yang lebih cepat, stabil, dan memiliki fitur terbaru. Silakan klik tombol di bawah untuk membuka dan beralih ke website baru sekarang.',
                targetUrl: '',
                buttonText: 'Buka Link Website Baru',
                badgeText: 'UPDATE WEBSITE RESMI',
                forceLock: true
            };

            var enabled = !!config.enabled;
            var title = config.title || 'Pembaruan Website MusifyStar';
            var message = config.message || 'Website MusifyStar telah berpindah ke alamat tautan (link) baru yang lebih cepat, stabil, dan memiliki fitur terbaru. Silakan klik tombol di bawah untuk membuka dan beralih ke website baru sekarang.';
            var targetUrl = config.targetUrl || '';
            var buttonText = config.buttonText || 'Buka Link Website Baru';
            var badgeText = config.badgeText || 'UPDATE WEBSITE RESMI';
            var forceLock = config.forceLock !== false;

            // Update status badge
            var badgeEl = gid('admin-siteupdate-status-badge');
            if (badgeEl) {
                if (enabled && targetUrl) badgeEl.classList.remove('hidden');
                else badgeEl.classList.add('hidden');
            }

            container.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-5">
                <!-- Header Info Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-blue-600/15 border border-cyan-500/30 shadow-lg relative overflow-hidden">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-black flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
                                <i data-lucide="external-link" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h3 class="text-sm sm:text-base font-black text-white tracking-tight">Banner Update Link Website (Tengah Layar)</h3>
                                <p class="text-xs text-white/70">Bukan pengumuman biasa &bull; Menutup setengah layar &bull; Pengguna tidak bisa menghapus/menutup</p>
                            </div>
                        </div>
                        <div class="shrink-0 flex items-center gap-2">
                            ${enabled ? `
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 animate-pulse">
                                    <span class="w-2 h-2 rounded-full bg-black"></span>
                                    <span>AKTIF DI LAYAR</span>
                                </div>` : `
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/50 border border-white/10">
                                    <span class="w-2 h-2 rounded-full bg-white/30"></span>
                                    <span>NONAKTIF</span>
                                </div>`
                            }
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-white/10 text-[11px] text-white/60 leading-relaxed flex items-start gap-2">
                        <i data-lucide="info" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
                        <span>Jika diaktifkan, banner berbentuk pop-up di tengah layar akan otomatis menutupi setengah layar dan mengunci aktivitas pengguna sampai mereka menekan tombol <b>Buka Link Website Baru</b> untuk beralih ke website baru.</span>
                    </div>
                </div>

                <!-- Form Controls -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-lg">
                    <!-- Status Switch -->
                    <div class="flex items-center justify-between pb-3 border-b border-white/10">
                        <div>
                            <span class="text-xs font-bold text-white block">Status Banner Tengah Layar</span>
                            <span class="text-[11px] text-white/50">Aktifkan untuk langsung menampilkan banner ke seluruh pengunjung</span>
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" id="admin-siteupdate-enabled" ${enabled ? 'checked' : ''} class="w-5 h-5 rounded text-cyan-500 bg-black/40 border-white/20 accent-cyan-500 cursor-pointer" />
                            <span class="text-xs font-bold text-cyan-300">Aktifkan</span>
                        </label>
                    </div>

                    <!-- Target URL -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white flex items-center justify-between">
                            <span class="flex items-center gap-1.5">
                                <i data-lucide="globe" class="w-3.5 h-3.5 text-cyan-400"></i>
                                <span>Alamat Link URL Website Baru (Wajib Diisi saat Aktif)</span>
                            </span>
                            <span class="text-[10px] text-cyan-400 font-mono">Format: https://...</span>
                        </label>
                        <input type="url" id="admin-siteupdate-url" value="${es(targetUrl)}" placeholder="https://musifystar-baru.example.com" class="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
                        <p class="text-[10px] text-white/40">Link tujuan saat pengunjung menekan tombol 'Buka Link Website'.</p>
                    </div>

                    <!-- Title -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white block">Judul Banner</label>
                        <input type="text" id="admin-siteupdate-title" value="${es(title)}" placeholder="Pembaruan Website MusifyStar" class="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm font-medium focus:outline-none focus:border-cyan-500 transition-all" />
                    </div>

                    <!-- Message -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white block">Pesan Pembaruan Website</label>
                        <textarea id="admin-siteupdate-message" rows="3" placeholder="Tuliskan pesan pemindahan/pembaruan link..." class="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm font-medium focus:outline-none focus:border-cyan-500 transition-all resize-y leading-relaxed">${es(message)}</textarea>
                    </div>

                    <!-- Button Text & Badge -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-white block">Teks Tombol Buka Link</label>
                            <input type="text" id="admin-siteupdate-btntext" value="${es(buttonText)}" placeholder="Buka Link Website Baru" class="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-medium focus:outline-none focus:border-cyan-500 transition-all" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-white block">Label Badge Atas</label>
                            <input type="text" id="admin-siteupdate-badgetext" value="${es(badgeText)}" placeholder="UPDATE WEBSITE RESMI" class="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-medium uppercase focus:outline-none focus:border-cyan-500 transition-all" />
                        </div>
                    </div>

                    <!-- Non-dismissible / Force Lock -->
                    <div class="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <span class="text-xs font-bold text-white block">Kunci Layar (Tidak Bisa Ditutup/Dihapus)</span>
                            <span class="text-[11px] text-white/50">Pengguna tidak dapat menutup pop-up tanpa mengklik link baru</span>
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" id="admin-siteupdate-forcelock" ${forceLock ? 'checked' : ''} class="w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20 accent-cyan-500 cursor-pointer" />
                            <span class="text-xs font-bold text-rose-400">Wajib Kunci</span>
                        </label>
                    </div>
                </div>

                <!-- Action Buttons: Preview & Save -->
                <div class="space-y-2">
                    <button type="button" onclick="Profile.previewSiteUpdateBanner()" class="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 active:scale-98 transition-all cursor-pointer">
                        <i data-lucide="eye" class="w-4 h-4 text-cyan-400"></i>
                        <span>Pratinjau / Test Tampilan Banner (Tengah Layar)</span>
                    </button>

                    <div class="flex flex-col sm:flex-row gap-2.5">
                        <button id="admin-save-siteupdate-btn" onclick="Profile.saveSiteUpdateConfig(true)" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer">
                            <i data-lucide="check" class="w-4 h-4"></i>
                            <span>Simpan & Terapkan Banner Sekarang</span>
                        </button>
                        ${enabled ? `
                        <button onclick="Profile.saveSiteUpdateConfig(false)" class="py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer">
                            <i data-lucide="power" class="w-4 h-4"></i>
                            <span>Matikan Banner</span>
                        </button>` : ''}
                    </div>
                </div>
            </div>`;

            if (window.lucide) lucide.createIcons();

        } catch (e) {
            if (container) {
                container.innerHTML = `
                <div class="text-center py-12 text-rose-400 space-y-2">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">Gagal memuat konfigurasi banner update: ${e.message}</p>
                </div>`;
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    previewSiteUpdateBanner() {
        var urlEl = gid('admin-siteupdate-url');
        var titleEl = gid('admin-siteupdate-title');
        var msgEl = gid('admin-siteupdate-message');
        var btnTextEl = gid('admin-siteupdate-btntext');
        var badgeEl = gid('admin-siteupdate-badgetext');
        var forceLockEl = gid('admin-siteupdate-forcelock');

        var previewData = {
            enabled: true,
            title: titleEl ? titleEl.value.trim() : 'Pembaruan Website MusifyStar',
            message: msgEl ? msgEl.value.trim() : 'Website MusifyStar telah berpindah ke alamat link baru.',
            targetUrl: (urlEl && urlEl.value.trim()) ? urlEl.value.trim() : 'https://musifystar.newdomain.com',
            buttonText: (btnTextEl && btnTextEl.value.trim()) ? btnTextEl.value.trim() : 'Buka Link Website Baru',
            badgeText: (badgeEl && badgeEl.value.trim()) ? badgeEl.value.trim() : 'UPDATE WEBSITE RESMI',
            forceLock: forceLockEl ? forceLockEl.checked : true,
            updatedAt: 'preview-' + Date.now()
        };

        if (window.App && typeof App.renderSiteUpdateBanner === 'function') {
            App.renderSiteUpdateBanner(previewData, true);
        }
    },

    async saveSiteUpdateConfig(overrideEnabled) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin berakhir, silakan login kembali.');
            return;
        }

        var enabledEl = gid('admin-siteupdate-enabled');
        var urlEl = gid('admin-siteupdate-url');
        var titleEl = gid('admin-siteupdate-title');
        var msgEl = gid('admin-siteupdate-message');
        var btnTextEl = gid('admin-siteupdate-btntext');
        var badgeEl = gid('admin-siteupdate-badgetext');
        var forceLockEl = gid('admin-siteupdate-forcelock');

        var enabled = overrideEnabled !== undefined ? overrideEnabled : (enabledEl ? enabledEl.checked : true);
        var targetUrl = urlEl ? urlEl.value.trim() : '';
        var title = titleEl ? titleEl.value.trim() : 'Pembaruan Website MusifyStar';
        var message = msgEl ? msgEl.value.trim() : '';
        var buttonText = btnTextEl ? btnTextEl.value.trim() : 'Buka Link Website Baru';
        var badgeText = badgeEl ? badgeEl.value.trim() : 'UPDATE WEBSITE RESMI';
        var forceLock = forceLockEl ? forceLockEl.checked : true;

        if (enabled && !targetUrl) {
            if (typeof showToast === 'function') showToast('Alamat URL Link Website Baru wajib diisi saat banner diaktifkan!');
            if (urlEl) urlEl.focus();
            return;
        }

        var btn = gid('admin-save-siteupdate-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menyimpan...</span>';
            if (window.lucide) lucide.createIcons();
        }

        try {
            var res = await fetch('/api/site-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    enabled: enabled,
                    targetUrl: targetUrl,
                    title: title,
                    message: message,
                    buttonText: buttonText,
                    badgeText: badgeText,
                    forceLock: forceLock
                })
            });

            var data = await res.json();
            if (data && data.status) {
                if (enabled) {
                    sessionStorage.removeItem('musifystar_admin_dismissed_site_update');
                    localStorage.removeItem('musifystar_admin_dismissed_site_update');
                }
                if (typeof showToast === 'function') {
                    showToast(data.message || (enabled ? 'Banner Update Link berhasil diaktifkan di tengah layar!' : 'Banner dinonaktifkan.'));
                }
                if (window.App && typeof App.renderSiteUpdateBanner === 'function') {
                    App.renderSiteUpdateBanner(data.config, false);
                }
                Profile.renderAdminSiteUpdateTab();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal menyimpan konfigurasi banner');
                }
            }
        } catch (e) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan jaringan: ' + e.message);
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> <span>Simpan & Terapkan Banner Sekarang</span>';
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    // ==========================================
    // 3. TAB SECURITY & TWO-FACTOR AUTH (2FA) & PASSWORD
    // ==========================================
    async renderAdminSecurityTab() {
        var container = gid('admin-security-container');
        if (!container) return;

        var token = Profile.getAdminToken();
        var twoFactorEnabled = false;

        try {
            var res = await fetch('/api/admin-auth', {
                headers: { 'x-admin-token': token || '' }
            });
            var authState = await res.json();
            twoFactorEnabled = !!authState.twoFactorEnabled;
        } catch (e) {}

        container.innerHTML = `
        <div class="max-w-xl mx-auto space-y-5">
            <!-- 1. TWO-FACTOR AUTHENTICATION (2FA) CARD -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 shadow-lg space-y-4">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-bold text-white">Two-Factor Authentication (2FA)</h3>
                                <span class="text-[10px] ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/10 text-white/50 border-white/10'} font-extrabold px-2 py-0.5 rounded-full uppercase border">
                                    ${twoFactorEnabled ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <p class="text-xs text-white/60">Pengamanan login admin dengan kode OTP 6 digit dari Google Authenticator / Authy</p>
                        </div>
                    </div>
                </div>

                <div id="admin-2fa-setup-box" class="pt-1">
                    ${twoFactorEnabled ? `
                    <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                        <div class="flex items-start gap-2.5 text-xs text-emerald-300">
                            <i data-lucide="check-circle-2" class="w-4 h-4 shrink-0 mt-0.5 text-emerald-400"></i>
                            <span>2FA aktif! Setiap kali login ke panel admin, Anda akan diminta memasukkan 6 digit kode OTP yang dihasilkan secara dinamis.</span>
                        </div>
                        <button onclick="Profile.disable2FA()" class="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95">
                            <i data-lucide="shield-off" class="w-3.5 h-3.5"></i>
                            <span>Nonaktifkan 2FA</span>
                        </button>
                    </div>` : `
                    <div class="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                        <p class="text-xs text-white/70 leading-relaxed">
                            Tingkatkan keamanan panel admin dari pembajakan dengan mewajibkan verifikasi OTP saat masuk.
                        </p>
                        <button onclick="Profile.start2FASetup()" id="admin-start-2fa-btn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95">
                            <i data-lucide="smartphone" class="w-4 h-4"></i>
                            <span>Mulai Setup 2FA (Scan QR)</span>
                        </button>
                    </div>`}
                </div>
            </div>

            <!-- 2. GANTI PASSWORD ADMIN -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-rose-500/10 border border-purple-500/20 shadow-lg space-y-4">
                <div class="flex items-center gap-3.5 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
                        <i data-lucide="key" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Ganti Password Admin</h3>
                        <p class="text-xs text-white/60">Perbarui kata sandi panel admin secara aman dan instan</p>
                    </div>
                </div>
                <div class="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-white/70 leading-relaxed flex items-start gap-2">
                    <i data-lucide="lock" class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"></i>
                    <span>Password baru akan di-hash secara aman menggunakan algoritma <strong>PBKDF2 SHA-512</strong> dengan salt kriptografis tanpa perlu menyentuh file kode sumber.</span>
                </div>

                <!-- Password Form -->
                <form id="admin-change-pass-form" onsubmit="Profile.changeAdminPassword(event)" class="space-y-4 pt-1">
                    <div id="admin-pass-alert" class="hidden p-3 rounded-xl text-xs font-semibold"></div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80 flex items-center justify-between">
                            <span>Password Lama</span>
                        </label>
                        <div class="relative">
                            <input id="admin-old-pass" type="password" required placeholder="Masukkan password admin saat ini" class="w-full px-3.5 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-all font-sans" />
                            <button type="button" onclick="Profile.togglePassVisibility('admin-old-pass', this)" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all cursor-pointer p-1">
                                <i data-lucide="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80 flex items-center justify-between">
                            <span>Password Baru</span>
                            <span id="admin-pass-strength" class="text-[10px] text-white/40 font-normal">Min. 4 karakter</span>
                        </label>
                        <div class="relative">
                            <input id="admin-new-pass" type="password" required placeholder="Masukkan password baru" oninput="Profile.checkPasswordStrength(this.value)" class="w-full px-3.5 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-all font-sans" />
                            <button type="button" onclick="Profile.togglePassVisibility('admin-new-pass', this)" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all cursor-pointer p-1">
                                <i data-lucide="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80">Konfirmasi Password Baru</label>
                        <div class="relative">
                            <input id="admin-confirm-pass" type="password" required placeholder="Ketik ulang password baru" class="w-full px-3.5 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-all font-sans" />
                            <button type="button" onclick="Profile.togglePassVisibility('admin-confirm-pass', this)" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all cursor-pointer p-1">
                                <i data-lucide="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit" id="admin-save-pass-btn" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 active:scale-98 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="save" class="w-4 h-4"></i>
                            <span>Simpan Password Baru</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>`;

        lucide.createIcons();
    },

    async start2FASetup() {
        var token = Profile.getAdminToken();
        var box = gid('admin-2fa-setup-box');
        var btn = gid('admin-start-2fa-btn');

        if (!token) {
            if (typeof showToast === 'function') {
                showToast('Silakan login ke panel admin terlebih dahulu');
            }
            return;
        }
        if (!box) return;

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menyiapkan QR Code...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ action: '2fa_setup', token: token })
            });
            var data = await res.json();

            if (data.status && data.secret) {
                box.innerHTML = `
                <div class="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <div class="text-center space-y-1">
                        <h4 class="text-xs font-bold text-white">Scan QR Code di Aplikasi Authenticator</h4>
                        <p class="text-[11px] text-white/60">Gunakan Google Authenticator, Microsoft Authenticator, atau Authy</p>
                    </div>

                    <div class="flex justify-center p-3 bg-white rounded-2xl max-w-[180px] mx-auto shadow-xl">
                        <img src="${data.qrUrl}" alt="2FA QR Code" class="w-36 h-36 rounded-lg" />
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] text-white/50 font-bold uppercase tracking-wider block text-center">Atau Masukkan Secret Key Manual</label>
                        <div class="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 justify-between">
                            <span class="tracking-widest">${data.secret}</span>
                            <button type="button" onclick="Profile.copy2FASecret('${data.secret}')" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white cursor-pointer transition">
                                Salin
                            </button>
                        </div>
                    </div>

                    <form onsubmit="Profile.confirm2FAEnable(event, '${data.secret}')" class="space-y-3 pt-2 border-t border-white/10">
                        <div id="admin-2fa-setup-alert" class="hidden p-2.5 rounded-xl text-xs font-semibold"></div>
                        <div class="space-y-1 text-center">
                            <label class="text-xs font-bold text-white">Masukkan 6 Digit Kode OTP Untuk Konfirmasi</label>
                            <input type="text" id="admin-setup-otp" required maxlength="6" pattern="[0-9]{6}" inputmode="numeric" placeholder="000000" class="w-full text-center text-xl font-mono tracking-[0.3em] py-2 bg-black/60 border border-white/20 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500" autofocus />
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="Profile.renderAdminSecurityTab()" class="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold transition">
                                Batal
                            </button>
                            <button type="submit" id="admin-confirm-2fa-btn" class="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                <span>Verifikasi & Aktifkan</span>
                            </button>
                        </div>
                    </form>
                </div>`;
                lucide.createIcons();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal memulai setup 2FA');
                }
                Profile.renderAdminSecurityTab();
            }
        } catch (e) {
            if (typeof showToast === 'function') {
                showToast('Gagal menghubungi server');
            }
            Profile.renderAdminSecurityTab();
        }
    },

    copy2FASecret(secret) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(secret);
            if (typeof showToast === 'function') {
                showToast('Secret Key disalin ke clipboard');
            }
        }
    },

    async confirm2FAEnable(event, secret) {
        if (event && event.preventDefault) event.preventDefault();

        var otpInput = gid('admin-setup-otp');
        var alertEl = gid('admin-2fa-setup-alert');
        var btn = gid('admin-confirm-2fa-btn');
        var token = Profile.getAdminToken();

        var otp = otpInput ? otpInput.value.trim() : '';
        if (!otp || otp.length !== 6 || !token) return;

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> <span>Memverifikasi...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    action: '2fa_enable',
                    secret: secret,
                    otp: otp,
                    token: token
                })
            });
            var data = await res.json();

            if (data.status && data.success) {
                if (typeof showToast === 'function') {
                    showToast('Two-Factor Authentication (2FA) berhasil diaktifkan!');
                }
                Profile.renderAdminSecurityTab();
            } else {
                if (alertEl) {
                    alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                    alertEl.innerText = data.message || 'Kode OTP salah!';
                    alertEl.classList.remove('hidden');
                }
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>Verifikasi & Aktifkan</span>';
                    lucide.createIcons();
                }
            }
        } catch (e) {
            if (alertEl) {
                alertEl.className = 'p-2.5 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                alertEl.innerText = 'Gagal memverifikasi OTP: ' + e.message;
                alertEl.classList.remove('hidden');
            }
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>Verifikasi & Aktifkan</span>';
                lucide.createIcons();
            }
        }
    },

    async disable2FA() {
        var token = Profile.getAdminToken();
        if (!token) return;

        var pwd = prompt('Masukkan password admin Anda untuk mengonfirmasi penonaktifan 2FA:');
        if (!pwd) return;

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    action: '2fa_disable',
                    password: pwd,
                    token: token
                })
            });
            var data = await res.json();
            if (data.status && data.success) {
                if (typeof showToast === 'function') {
                    showToast('2FA telah dinonaktifkan.');
                }
                Profile.renderAdminSecurityTab();
            } else {
                alert(data.message || 'Gagal menonaktifkan 2FA');
            }
        } catch (e) {
            alert('Gagal menghubungi server');
        }
    },

    togglePassVisibility(inputId, btn) {
        var el = gid(inputId);
        if (!el) return;
        var isPass = el.type === 'password';
        el.type = isPass ? 'text' : 'password';
        if (btn) {
            btn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
            lucide.createIcons();
        }
    },

    checkPasswordStrength(val) {
        var strengthEl = gid('admin-pass-strength');
        if (!strengthEl) return;
        if (!val || val.length === 0) {
            strengthEl.innerText = 'Min. 4 karakter';
            strengthEl.className = 'text-[10px] text-white/40 font-normal';
        } else if (val.length < 4) {
            strengthEl.innerText = 'Terlalu Pendek';
            strengthEl.className = 'text-[10px] text-rose-400 font-bold';
        } else if (val.length < 8) {
            strengthEl.innerText = 'Sedang';
            strengthEl.className = 'text-[10px] text-amber-400 font-bold';
        } else {
            strengthEl.innerText = 'Kuat & Aman';
            strengthEl.className = 'text-[10px] text-emerald-400 font-bold';
        }
    },

    async changeAdminPassword(event) {
        if (event && event.preventDefault) event.preventDefault();

        var oldPassEl = gid('admin-old-pass');
        var newPassEl = gid('admin-new-pass');
        var confirmPassEl = gid('admin-confirm-pass');
        var alertEl = gid('admin-pass-alert');
        var saveBtn = gid('admin-save-pass-btn');
        var token = Profile.getAdminToken();

        if (!newPassEl || !confirmPassEl || !oldPassEl) return;

        var oldPassword = oldPassEl.value;
        var newPassword = newPassEl.value;
        var confirmPassword = confirmPassEl.value;

        if (newPassword.length < 4) {
            if (alertEl) {
                alertEl.className = 'p-3 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                alertEl.innerText = 'Password baru minimal harus 4 karakter!';
                alertEl.classList.remove('hidden');
            }
            return;
        }

        if (newPassword !== confirmPassword) {
            if (alertEl) {
                alertEl.className = 'p-3 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                alertEl.innerText = 'Konfirmasi password baru tidak cocok!';
                alertEl.classList.remove('hidden');
            }
            return;
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menyimpan...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token || ''
                },
                body: JSON.stringify({
                    action: 'change_password',
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    token: token
                })
            });
            var data = await res.json();

            if (data.status && data.success) {
                if (alertEl) {
                    alertEl.className = 'p-3 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                    alertEl.innerText = data.message || 'Password admin berhasil diperbarui secara aman!';
                    alertEl.classList.remove('hidden');
                }
                oldPassEl.value = '';
                newPassEl.value = '';
                confirmPassEl.value = '';
                if (typeof showToast === 'function') {
                    showToast('Password admin berhasil diperbarui!');
                }
            } else {
                if (alertEl) {
                    alertEl.className = 'p-3 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                    alertEl.innerText = data.message || 'Gagal mengubah password admin.';
                    alertEl.classList.remove('hidden');
                }
            }
        } catch (err) {
            if (alertEl) {
                alertEl.className = 'p-3 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30';
                alertEl.innerText = 'Terjadi kesalahan jaringan atau server: ' + err.message;
                alertEl.classList.remove('hidden');
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> <span>Simpan Password Baru</span>';
                lucide.createIcons();
            }
        }
    },

    // 2. FEEDBACK INBOX LOADER & RENDERER
    async loadAdminFeedbacks() {
        var container = gid('admin-feedbacks-container');
        var badgeEl = gid('admin-feedback-badge');
        var token = Profile.getAdminToken();

        if (!token) return;

        try {
            var res = await fetch('/api/feedback', {
                headers: { 'x-admin-token': token }
            });
            var data = await res.json();

            if (!data.status || !Array.isArray(data.feedbacks)) {
                if (container) {
                    container.innerHTML = `
                    <div class="text-center py-12 text-red-400 space-y-2">
                        <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                        <p class="text-xs font-semibold">Gagal memuat pesan masukan.</p>
                    </div>`;
                    lucide.createIcons();
                }
                return;
            }

            var feedbacks = data.feedbacks;
            var unread = feedbacks.filter(function(f){ return !f.isRead; }).length;

            if (badgeEl) {
                if (unread > 0) {
                    badgeEl.innerText = unread;
                    badgeEl.classList.remove('hidden');
                } else {
                    badgeEl.classList.add('hidden');
                }
            }

            if (feedbacks.length === 0) {
                if (container) {
                    container.innerHTML = `
                    <div class="text-center py-16 text-white/50 space-y-3">
                        <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                            <i data-lucide="inbox" class="w-7 h-7"></i>
                        </div>
                        <h4 class="text-sm font-bold text-white">Belum Ada Masukan Pengguna</h4>
                        <p class="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                            Pesan dan masukan yang dikirim melalui tombol masukan di profil akan otomatis tampil di sini.
                        </p>
                    </div>`;
                    lucide.createIcons();
                }
                return;
            }

            var html = '';
            feedbacks.forEach(function(item) {
                var dateStr = '';
                try {
                    var d = new Date(item.createdAt);
                    dateStr = d.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch(e) {
                    dateStr = item.createdAt;
                }

                // Detect if user was logged in
                var isLogged = !!(item.userLogged || item.username || (item.email && item.email.includes('@')));
                var rawEmail = item.email || (item.contact && item.contact.includes('@') ? item.contact : '');
                var sensoredEmail = Profile.maskEmail(rawEmail);
                var dispName = item.username || item.name || 'Pengguna';
                var isVerified = (rawEmail === 'jrnabil570@gmail.com') || (item.contact === 'jrnabil570@gmail.com');
                var avatarUrl = item.userAvatar || (dispName ? ('https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(dispName)) : '/logo.png');

                // Detect if contact is phone or email for direct quick-actions
                var contact = item.contact || '-';
                var contactAction = '';
                if (contact !== '-') {
                    var cleanNum = contact.replace(/[^0-9+]/g, '');
                    if (cleanNum.length >= 8) {
                        var waNum = cleanNum;
                        if (waNum.startsWith('0')) waNum = '62' + waNum.substring(1);
                        contactAction = `<a href="https://wa.me/${waNum}" target="_blank" class="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"><i data-lucide="phone" class="w-3 h-3"></i> WhatsApp</a>`;
                    } else if (contact.includes('@')) {
                        contactAction = `<a href="mailto:${contact}" class="text-[11px] text-sky-400 hover:underline flex items-center gap-1"><i data-lucide="mail" class="w-3 h-3"></i> Email</a>`;
                    }
                }

                // Sender Info Block (Logged-In vs Guest/No Login)
                var senderHeaderHtml = '';
                if (isLogged) {
                    senderHeaderHtml = `
                    <div class="flex items-center gap-3">
                        <img src="${avatarUrl}" class="w-10 h-10 rounded-full object-cover bg-black/50 border border-white/20 shrink-0 shadow-md" onerror="this.src='/logo.png'" />
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="text-sm font-bold text-white inline-flex items-center leading-tight"><span>${dispName}</span>${isVerified ? (typeof Auth !== 'undefined' ? `<span class="global-verified-badge-container">${Auth.getVerifiedBadgeHTML()}</span>` : '') : ''}</h4>
                                ${!item.isRead ? '<span class="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">Baru</span>' : ''}
                            </div>
                            <div class="flex items-center gap-2 text-[11px] mt-0.5 flex-wrap">
                                <span class="text-sky-300/90 font-mono font-medium">${sensoredEmail || 'Terautentikasi'}</span>
                                <span class="text-white/30">&bull;</span>
                                <span class="text-white/50 flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3"></i> ${dateStr}
                                </span>
                            </div>
                        </div>
                    </div>`;
                } else {
                    senderHeaderHtml = `
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/30 to-purple-500/30 text-rose-300 font-bold text-xs flex items-center justify-center shrink-0">
                            <i data-lucide="user" class="w-4 h-4"></i>
                        </span>
                        <div>
                            <h4 class="text-sm font-bold text-white flex items-center gap-2">
                                ${item.name}
                                ${!item.isRead ? '<span class="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">Baru</span>' : ''}
                            </h4>
                            <span class="text-[11px] text-white/50 flex items-center gap-1">
                                <i data-lucide="clock" class="w-3 h-3"></i> ${dateStr}
                            </span>
                        </div>
                    </div>`;
                }

                html += `
                <div class="p-4 rounded-2xl ${item.isRead ? 'bg-white/[0.02] border-white/5' : 'bg-gradient-to-r from-rose-500/[0.06] to-purple-500/[0.03] border-rose-500/30'} border transition-all flex flex-col gap-3 relative group">
                    <div class="flex items-start justify-between gap-3">
                        ${senderHeaderHtml}

                        <div class="flex items-center gap-1.5 shrink-0">
                            <button onclick="Profile.toggleFeedbackRead('${item.id}', ${!item.isRead})" class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition active:scale-90" title="${item.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}">
                                <i data-lucide="${item.isRead ? 'mail' : 'mail-check'}" class="w-4 h-4"></i>
                            </button>
                            <button onclick="Profile.deleteFeedback('${item.id}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition active:scale-90" title="Hapus Pesan">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Isi Pesan -->
                    <div class="bg-black/30 p-3 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed whitespace-pre-wrap font-sans break-words">${item.message ? item.message.trim() : ''}</div>

                    <!-- Kontak / Info Balasan -->
                    <div class="flex items-center justify-between text-[11px] text-white/60 pt-1 border-t border-white/5">
                        <div class="flex items-center gap-1.5">
                            <i data-lucide="contact" class="w-3.5 h-3.5 text-rose-400"></i>
                            <span>Kontak Balasan: <strong class="text-white">${contact}</strong></span>
                        </div>
                        ${contactAction}
                    </div>
                </div>`;
            });

            if (container) {
                container.innerHTML = html;
                lucide.createIcons();
            }
        } catch (err) {
            if (container) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="wifi-off" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">Kesalahan saat menghubungi server.</p>
                </div>`;
                lucide.createIcons();
            }
        }
    },

    // Toggle status dibaca
    async toggleFeedbackRead(id, isRead) {
        var token = Profile.getAdminToken();
        if (!token) return;

        try {
            await fetch('/api/feedback', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ id: id, isRead: isRead })
            });
            Profile.loadAdminFeedbacks();
        } catch(e) {}
    },

    // Hapus pesan feedback
    async deleteFeedback(id) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan');
            return;
        }

        Profile.showConfirmModal({
            title: 'Hapus Pesan Masukan',
            message: 'Apakah Anda yakin ingin menghapus pesan saran/masukan ini dari daftar?',
            confirmText: 'Ya, Hapus Pesan',
            confirmClass: 'bg-red-600 hover:bg-red-700 shadow-red-500/40',
            onConfirm: async function() {
                try {
                    var res = await fetch('/api/feedback', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': token
                        },
                        body: JSON.stringify({ id: id })
                    });
                    var data = await res.json();
                    if (data && data.status) {
                        if (typeof showToast === 'function') {
                            showToast('Pesan berhasil dihapus');
                        }
                        Profile.loadAdminFeedbacks();
                    } else {
                        if (typeof showToast === 'function') {
                            showToast(data?.message || 'Gagal menghapus pesan');
                        }
                    }
                } catch(e) {
                    if (typeof showToast === 'function') {
                        showToast('Terjadi kesalahan koneksi');
                    }
                }
            }
        });
    },

    // Keluar dari sesi admin
    async adminLogout() {
        var token = Profile.getAdminToken();
        if (token) {
            try {
                await fetch('/api/admin-auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'logout', token: token })
                });
            } catch (e) {}
        }
        Profile.setAdminToken(null);
        Profile.closeAdminModal();
        if (typeof showToast === 'function') {
            showToast('Telah keluar dari sesi admin');
        }
    },

    // 4. APP VERSION MANAGEMENT TAB
    async renderAdminVersionTab(silent) {
        var container = gid('admin-version-container');
        if (!container) return;

        if (!silent && (!container.innerHTML || container.innerHTML.includes('loader-2'))) {
            container.innerHTML = `
            <div class="text-center py-12 text-white/50 space-y-2">
                <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-sky-400"></i>
                <p class="text-xs">Memuat konfigurasi versi aplikasi...</p>
            </div>`;
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/version');
            var data = await res.json();
            var currentVersion = (data && data.version) ? data.version : (Profile.appVersion || 'v1.0.0');
            var releaseName = (data && data.releaseName) ? data.releaseName : 'MusifyStar Official';
            var description = (data && data.description) ? data.description : 'Nikmati Streaming Musik Dengan Lirik';
            var updatedAt = data && data.updatedAt ? new Date(data.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Baru saja';

            Profile.appVersion = currentVersion;
            Profile.appReleaseName = releaseName;

            var vBadge = gid('admin-version-tab-badge');
            if (vBadge) vBadge.innerText = currentVersion;

            container.innerHTML = `
            <div class="space-y-4">
                <!-- Header Banner -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
                            <i data-lucide="tag" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-black text-white">Pengaturan Versi Aplikasi</h3>
                                <span class="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold px-2 py-0.5 rounded-full font-mono">
                                    ${currentVersion}
                                </span>
                            </div>
                            <p class="text-xs text-white/60 mt-0.5">Ubah nomor rilis sistem yang tampil di halaman profil dan informasi aplikasi.</p>
                        </div>
                    </div>
                </div>

                <!-- Active Version Live Preview Card -->
                <div class="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                            <svg class="w-6 h-6 drop-shadow-md" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#0284c7"/>
                                <path d="M7.8 12.2L10.8 15.2L16.2 9.2" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-white">MusifyStar</span>
                                <span class="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20">${currentVersion}</span>
                            </div>
                            <p class="text-[11px] text-white/50">${releaseName} &bull; Terakhir diubah: ${updatedAt}</p>
                        </div>
                    </div>
                    <span class="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Aktif
                    </span>
                </div>

                <!-- Form Edit Versi -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div id="admin-version-status" class="hidden p-3 rounded-xl text-xs flex items-center gap-2"></div>

                    <form onsubmit="Profile.saveAppVersionConfig(event)" class="space-y-4">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="block text-xs font-bold text-white/80 uppercase tracking-wider">
                                    Nomor Versi Aplikasi <span class="text-sky-400">*</span>
                                </label>
                                <span class="text-[11px] text-white/40">Contoh: v1.0.1, v1.2.0, v2.0.0</span>
                            </div>
                            <div class="relative">
                                <i data-lucide="hash" class="w-4 h-4 text-white/40 absolute left-3.5 top-3.5"></i>
                                <input type="text" id="admin-version-input" required value="${currentVersion}" placeholder="v1.0.0" class="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-400 transition-all shadow-inner" />
                            </div>
                        </div>

                        <!-- Quick Increment Preset Buttons -->
                        <div>
                            <span class="block text-[11px] font-semibold text-white/60 mb-2">Pintas Naikkan Versi (Quick Increment):</span>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <button type="button" onclick="Profile.incrementAppVersion('patch')" class="py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-white/90 hover:text-white font-mono font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i data-lucide="plus" class="w-3.5 h-3.5 text-sky-400"></i> + Patch (+0.0.1)
                                </button>
                                <button type="button" onclick="Profile.incrementAppVersion('minor')" class="py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-white/90 hover:text-white font-mono font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i data-lucide="plus" class="w-3.5 h-3.5 text-blue-400"></i> + Minor (+0.1.0)
                                </button>
                                <button type="button" onclick="Profile.incrementAppVersion('major')" class="py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-white/90 hover:text-white font-mono font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i data-lucide="plus" class="w-3.5 h-3.5 text-indigo-400"></i> + Major (+1.0.0)
                                </button>
                                <button type="button" onclick="Profile.incrementAppVersion('reset')" class="py-2 px-3 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/90 hover:text-white font-mono font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-rose-400"></i> Reset v1.0.0
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            <div>
                                <label class="block text-xs font-bold text-white/80 mb-1.5 uppercase tracking-wider">
                                    Nama Rilis / Edisi
                                </label>
                                <input type="text" id="admin-version-release" value="${releaseName}" placeholder="MusifyStar Official" class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-white/80 mb-1.5 uppercase tracking-wider">
                                    Deskripsi Singkat
                                </label>
                                <input type="text" id="admin-version-desc" value="${description}" placeholder="Nikmati Streaming Musik Dengan Lirik" class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400 transition-all shadow-inner" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-white/80 mb-1.5 uppercase tracking-wider">
                                Catatan Pembaruan (Release Notes / Changelog)
                            </label>
                            <textarea id="admin-version-notes" rows="2" placeholder="Tuliskan fitur baru atau perbaikan di versi ini..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-sky-400 transition-all shadow-inner leading-relaxed">${data.releaseNotes || 'Pembaruan stabilitas dan peningkatan fitur aplikasi.'}</textarea>
                        </div>

                        <!-- PWA Auto-Reload Force Switch -->
                        <div class="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3">
                            <div class="space-y-0.5">
                                <div class="flex items-center gap-1.5">
                                    <i data-lucide="zap" class="w-4 h-4 text-sky-400"></i>
                                    <span class="text-xs font-bold text-white">Paksa Pembaruan Otomatis ke Seluruh HP Pengguna (Instant Bumper)</span>
                                </div>
                                <p class="text-[11px] text-white/60 leading-relaxed">
                                    Saat disimpan, seluruh HP dan browser pengguna yang sedang membuka aplikasi akan otomatis mengunduh cache Service Worker baru dan me-reload halaman seketika.
                                </p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer shrink-0">
                                <input type="checkbox" id="admin-version-force-reload" checked class="sr-only peer">
                                <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                            </label>
                        </div>

                        <div class="pt-2 border-t border-white/10 flex items-center justify-end">
                            <button type="submit" id="admin-version-save-btn" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                <i data-lucide="rocket" class="w-4 h-4"></i>
                                <span>🚀 Perbarui Versi & Bump PWA Sekarang</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>`;

            lucide.createIcons();
        } catch (e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Gagal memuat konfigurasi versi.</p>
            </div>`;
            lucide.createIcons();
        }
    },

    // Helper increment version
    incrementAppVersion(type) {
        var input = gid('admin-version-input');
        if (!input) return;
        var current = input.value.trim() || Profile.appVersion || 'v1.0.0';
        var hasV = current.startsWith('v') || current.startsWith('V');
        var numStr = current.replace(/^[vV]/, '');
        var parts = numStr.split('.').map(function(n) { return parseInt(n, 10) || 0; });
        while (parts.length < 3) parts.push(0);

        var major = parts[0];
        var minor = parts[1];
        var patch = parts[2];

        if (type === 'patch') {
            patch += 1;
        } else if (type === 'minor') {
            minor += 1;
            patch = 0;
        } else if (type === 'major') {
            major += 1;
            minor = 0;
            patch = 0;
        } else if (type === 'reset') {
            major = 1;
            minor = 0;
            patch = 0;
        }

        var newVer = (hasV ? 'v' : 'v') + major + '.' + minor + '.' + patch;
        input.value = newVer;
        
        input.classList.add('ring-2', 'ring-sky-400');
        setTimeout(function() {
            input.classList.remove('ring-2', 'ring-sky-400');
        }, 300);
    },

    // Simpan versi aplikasi
    async saveAppVersionConfig(event) {
        if (event && event.preventDefault) event.preventDefault();

        var token = Profile.getAdminToken();
        if (!token) return;

        var vInput = gid('admin-version-input');
        var rInput = gid('admin-version-release');
        var dInput = gid('admin-version-desc');
        var nInput = gid('admin-version-notes');
        var forceReloadEl = gid('admin-version-force-reload');
        var statusBox = gid('admin-version-status');
        var saveBtn = gid('admin-version-save-btn');

        var version = (vInput ? vInput.value : '').trim();
        var releaseName = (rInput ? rInput.value : '').trim();
        var description = (dInput ? dInput.value : '').trim();
        var releaseNotes = (nInput ? nInput.value : '').trim();
        var forceReload = forceReloadEl ? forceReloadEl.checked : true;

        if (!version) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>Versi aplikasi tidak boleh kosong.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
            return;
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.classList.add('opacity-70');
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Memperbarui & Mem-bump PWA...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/version', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    version: version,
                    releaseName: releaseName,
                    description: description,
                    releaseNotes: releaseNotes,
                    forceReload: forceReload
                })
            });
            var data = await res.json();

            if (data.status) {
                var updatedVer = data.version || version;
                Profile.appVersion = updatedVer;
                window.activeAppVersion = updatedVer;
                Profile.appReleaseName = data.releaseName || releaseName;

                // Update UI Profil dan Badge Tab
                var vEl = gid('profile-app-version');
                if (vEl) vEl.innerText = updatedVer;
                var vBadge = gid('admin-version-tab-badge');
                if (vBadge) vBadge.innerText = updatedVer;

                if (typeof showToast === 'function') {
                    showToast('🚀 Versi PWA berhasil dinaikkan ke ' + updatedVer);
                }

                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
                    statusBox.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i><span>Versi PWA berhasil dinaikkan ke <strong>' + updatedVer + '</strong>. Cache Service Worker diperbarui dan semua perangkat pengguna otomatis disinkronkan.</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }

                Profile.renderAdminVersionTab(true);
            } else {
                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                    statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>' + (data.message || 'Gagal mengubah versi') + '</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }
            }
        } catch (e) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="wifi-off" class="w-4 h-4 shrink-0"></i><span>Koneksi bermasalah saat menyimpan versi.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.classList.remove('opacity-70');
                saveBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i><span>Simpan & Terapkan Versi</span>';
                lucide.createIcons();
            }
        }
    },

    // ==========================================
    // LOG LOGIN & ATUR SANKSI / BLOKIR TAB SEPARATION
    // ==========================================
    cachedAdminUsers: [],

    formatIpDisplay(ip) {
        if (!ip) return '<span class="font-mono text-sky-300 font-bold">127.0.0.1</span>';
        var clean = String(ip).trim();
        if (clean.startsWith('::ffff:')) {
            clean = clean.replace('::ffff:', '');
        }
        var isIpv6 = clean.includes(':');
        var badgeText = isIpv6 ? 'IPv6 Seluler/ISP' : 'IPv4';
        var badgeBg = isIpv6 ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

        return `<div class="inline-flex items-center gap-1.5 flex-wrap">
            <span onclick="navigator.clipboard.writeText('${clean}'); if(typeof showToast==='function') showToast('Alamat IP disalin: ${clean}');" title="Klik untuk Salin IP" class="font-mono text-sky-300 font-bold break-all cursor-pointer hover:underline hover:text-sky-200 transition-colors">${clean}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded ${badgeBg} border font-sans font-semibold shrink-0 cursor-help" title="${isIpv6 ? 'Alamat IPv6 diterbitkan otomatis oleh Operator Seluler / Provider ISP' : 'Alamat IPv4 Format Standar'}">${badgeText}</span>
        </div>`;
    },

    // 1. LOG LOGIN PENGGUNA TAB (TAB 7)
    async loadAdminUsersList() {
        var container = gid('admin-users-container');
        var token = Profile.getAdminToken();
        if (!container || !token) return;

        container.innerHTML = `
        <div class="text-center py-12 text-white/50 space-y-2">
            <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-sky-400"></i>
            <p class="text-xs font-semibold">Memuat log login & riwayat IP pengguna...</p>
        </div>`;
        if (window.lucide) lucide.createIcons();

        try {
            var res = await fetch('/api/user-auth?action=admin_get_users', {
                headers: { 'x-admin-token': token }
            });
            var data = await res.json();

            if (!data.status || !Array.isArray(data.users)) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">${data.message || 'Gagal memuat data pengguna'}</p>
                </div>`;
                if (window.lucide) lucide.createIcons();
                return;
            }

            var users = data.users;
            Profile.cachedAdminUsers = users;

            if (users.length === 0) {
                container.innerHTML = `
                <div class="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/50 text-xs space-y-2">
                    <i data-lucide="users" class="w-8 h-8 mx-auto text-white/30"></i>
                    <p class="font-bold text-white/80">Belum Ada Pengguna Terdaftar</p>
                    <p class="text-[11px] text-white/40">Setiap pengguna yang mendaftar atau login di aplikasi MusifyStar akan terekam otomatis di sini.</p>
                </div>`;
                if (window.lucide) lucide.createIcons();
                return;
            }

            var html = `
            <div class="space-y-4">
                <!-- Header Info Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-500/30">
                            <i data-lucide="history" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">Log Login & Alamat IP Pengguna</h3>
                            <p class="text-xs text-white/60">Lihat IP Address (IPv4 / IPv6), tanggal pendaftaran, password disensor, dan riwayat login seluruh pengguna</p>
                        </div>
                    </div>
                    <div class="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold shrink-0 self-start sm:self-auto">
                        Total: ${users.length} Pengguna
                    </div>
                </div>

                <!-- Live Search Input Bar -->
                <div class="relative">
                    <i data-lucide="search" class="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                    <input id="admin-user-search-input" type="text" oninput="Profile.filterAdminUsersList()" placeholder="Cari berdasarkan Username, Email, atau Alamat IP (IPv4 / IPv6)..." class="w-full bg-white/5 border border-white/10 focus:border-sky-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all shadow-inner">
                    <button onclick="var el=gid('admin-user-search-input'); if(el) el.value=''; Profile.filterAdminUsersList();" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer" title="Hapus Pencarian">
                        <i data-lucide="x-circle" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- User Log Cards List Container -->
                <div id="admin-users-cards-list" class="space-y-3">
                    ${Profile.renderUserLogCardsHtml(users)}
                </div>
            </div>`;

            container.innerHTML = html;

            if (window.lucide) lucide.createIcons();
            if (typeof Auth !== 'undefined' && typeof Auth.syncVerifiedBadges === 'function') {
                Auth.syncVerifiedBadges();
            }
        } catch (e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="wifi-off" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Terjadi kesalahan saat memuat data pengguna: ${e.message}</p>
            </div>`;
            if (window.lucide) lucide.createIcons();
        }
    },

    renderUserLogCardsHtml(users) {
        if (!users || users.length === 0) return '';

        return users.map(function(u) {
            var regDateFormatted = Profile.formatUserLocalDateTime(u.createdAt);
            var lastLoginFormatted = Profile.formatUserLocalDateTime(u.lastLoginAt);

            var logsCount = (u.loginLogs || []).length;
            var logsHtml = (u.loginLogs || []).map(function(log, idx) {
                return `
                <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] gap-2 flex-wrap">
                    <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-sky-400">#${idx+1}</span>
                        <div class="bg-black/40 px-2 py-0.5 rounded border border-white/10">
                            ${Profile.formatIpDisplay(log.ip)}
                        </div>
                    </div>
                    <span class="text-white/50 text-[10px]">${Profile.formatUserLocalDateTime(log.timestamp)}</span>
                </div>`;
            }).join('');

            return `
            <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-lg">
                <!-- User Profile Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div class="flex items-center gap-3 min-w-0">
                        <img src="${u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.username}" class="w-11 h-11 rounded-2xl object-cover bg-black/40 border border-white/15 shrink-0 shadow-md" alt="${u.username}">
                        <div class="min-w-0">
                            <h4 class="text-sm font-bold text-white truncate flex items-center gap-1.5">
                                <span>${u.username}</span>
                                <span class="global-verified-badge-container inline-flex items-center"></span>
                            </h4>
                            <p class="text-xs text-white/60 truncate flex items-center gap-1 mt-0.5">
                                <i data-lucide="mail" class="w-3 h-3 text-sky-400 shrink-0"></i>
                                <span>${u.email}</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0 flex-wrap">
                        <button onclick="Profile.selectUserForBanForm('${esJs(u.username)}', '${esJs(u.email)}', '${esJs(u.lastIp)}', '${esJs(u.id)}')" class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer" title="Beri Sanksi / Banned">
                            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-400"></i>
                            <span>Beri Sanksi</span>
                        </button>
                        <button onclick="Profile.confirmAdminDeleteUser('${esJs(u.id)}', '${esJs(u.username)}', '${esJs(u.email)}')" class="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md" title="Hapus Akun Pengguna Secara Permanen">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i>
                            <span>Hapus Akun</span>
                        </button>
                    </div>
                </div>

                <!-- User Details Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <span class="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Alamat IP Terakhir</span>
                        <div class="mt-1">
                            ${Profile.formatIpDisplay(u.lastIp)}
                        </div>
                        <div class="mt-1.5 pt-1.5 border-t border-white/10 text-[11px] font-mono text-amber-300/90 truncate flex items-center gap-1">
                            <i data-lucide="fingerprint" class="w-3 h-3 text-amber-400 shrink-0"></i>
                            <span onclick="navigator.clipboard.writeText('${u.id}'); if(typeof showToast==='function') showToast('ID disalin: ${u.id}');" class="cursor-pointer hover:underline" title="Klik untuk Salin User ID">ID: ${u.id}</span>
                        </div>
                    </div>

                    <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                        <span class="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Password diSensor</span>
                        <span class="font-mono text-xs font-bold text-amber-300 flex items-center gap-1 mt-1">
                            <i data-lucide="eye-off" class="w-3 h-3 text-amber-400"></i> ${u.maskedPassword || '••••••••'}
                        </span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                        <span class="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Terdaftar Tanggal</span>
                        <span class="text-xs text-white/80 font-medium truncate block mt-1">${regDateFormatted}</span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                        <span class="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Terakhir Login</span>
                        <span class="text-xs text-emerald-300 font-medium truncate block mt-1">${lastLoginFormatted}</span>
                    </div>
                </div>

                <!-- Collapsible Login Logs -->
                <details class="group/logs">
                    <summary class="text-xs font-bold text-white/70 hover:text-white cursor-pointer select-none flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 transition-colors">
                        <span class="flex items-center gap-1.5">
                            <i data-lucide="history" class="w-3.5 h-3.5 text-sky-400"></i>
                            <span>Riwayat Sesi Login (${logsCount} Sesi Terekam)</span>
                        </span>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-white/40 group-open/logs:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="pt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        ${logsHtml || '<p class="text-[11px] text-white/40 p-2">Belum ada riwayat log login tambahan.</p>'}
                    </div>
                </details>
            </div>`;
        }).join('');
    },

    filterAdminUsersList() {
        var input = gid('admin-user-search-input');
        var query = (input ? input.value : '').trim().toLowerCase();
        var users = Profile.cachedAdminUsers || [];
        var cardsContainer = gid('admin-users-cards-list');
        if (!cardsContainer) return;

        var filtered = users.filter(function(u) {
            if (!query) return true;
            var uname = (u.username || '').toLowerCase();
            var email = (u.email || '').toLowerCase();
            var lastIp = (u.lastIp || '').toLowerCase();
            var logsMatch = (u.loginLogs || []).some(function(l) {
                return (l.ip || '').toLowerCase().includes(query);
            });
            return uname.includes(query) || email.includes(query) || lastIp.includes(query) || logsMatch;
        });

        if (filtered.length === 0) {
            cardsContainer.innerHTML = `
            <div class="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/50 text-xs space-y-2">
                <i data-lucide="search-x" class="w-8 h-8 mx-auto text-white/30"></i>
                <p class="font-bold text-white/80">Pengguna Tidak Ditemukan</p>
                <p class="text-[11px] text-white/40">Tidak ada pengguna yang cocok dengan kata kunci "${query}".</p>
            </div>`;
            if (window.lucide) lucide.createIcons();
            return;
        }

        cardsContainer.innerHTML = Profile.renderUserLogCardsHtml(filtered);
        if (window.lucide) lucide.createIcons();
        if (typeof Auth !== 'undefined' && typeof Auth.syncVerifiedBadges === 'function') {
            Auth.syncVerifiedBadges();
        }
    },

    // 2. ATUR SANKSI & BLOKIR TAB (TAB 8)
    async loadAdminBansList() {
        var container = gid('admin-bans-container');
        var token = Profile.getAdminToken();
        if (!container || !token) return;

        container.innerHTML = `
        <div class="text-center py-12 text-white/50 space-y-2">
            <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-rose-400"></i>
            <p class="text-xs font-semibold">Memuat data sanksi & status ban pengguna...</p>
        </div>`;
        if (window.lucide) lucide.createIcons();

        try {
            var res = await fetch('/api/user-auth?action=admin_get_users', {
                headers: { 'x-admin-token': token }
            });
            var data = await res.json();

            if (!data.status || !Array.isArray(data.users)) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">${data.message || 'Gagal memuat data sanksi'}</p>
                </div>`;
                if (window.lucide) lucide.createIcons();
                return;
            }

            var users = data.users;
            Profile.cachedAdminUsers = users;

            // Compute counts
            var activeCount = 0;
            var tempBanCount = 0;
            var permBanCount = 0;
            var warnCount = 0;

            users.forEach(function(u) {
                var b = u.banStatus || { isBanned: false, isWarning: false, banType: 'none' };
                if (b.isBanned) {
                    if (u.banType === 'permanent') permBanCount++;
                    else tempBanCount++;
                } else if (b.isWarning || u.banType === 'warning') {
                    warnCount++;
                } else {
                    activeCount++;
                }
            });

            var totalSanctioned = tempBanCount + permBanCount + warnCount;
            var badgeEl = gid('admin-banned-count-badge');
            if (badgeEl) {
                if (totalSanctioned > 0) {
                    badgeEl.innerText = totalSanctioned;
                    badgeEl.classList.remove('hidden');
                } else {
                    badgeEl.classList.add('hidden');
                }
            }

            // Also fetch Banned IPs List
            var bannedIpsList = [];
            try {
                var resIps = await fetch('/api/user-auth?action=admin_get_banned_ips', {
                    headers: { 'x-admin-token': token }
                });
                var dataIps = await resIps.json();
                if (dataIps.status && Array.isArray(dataIps.bannedIps)) {
                    bannedIpsList = dataIps.bannedIps;
                }
            } catch(e){}

            // Build Banned IPs Cards HTML
            var ipListHtml = '';
            if (bannedIpsList.length === 0) {
                ipListHtml = `<div class="p-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-white/40 text-xs">Belum ada Alamat IP yang masuk dalam daftar hitam blacklist IP khusus</div>`;
            } else {
                ipListHtml = bannedIpsList.map(function(item) {
                    var expText = item.banExpiresAt ? new Date(item.banExpiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Permanen';
                    return `
                    <div class="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-xs shadow-lg">
                        <div class="space-y-1">
                            <div class="font-mono font-bold text-red-200 flex items-center gap-2 flex-wrap">
                                <i data-lucide="wifi-off" class="w-4 h-4 text-red-400"></i>
                                <span class="text-sm">${item.ip}</span>
                                <span class="text-[9px] px-2 py-0.5 rounded-full bg-red-500/30 border border-red-500/50 text-red-200 uppercase font-sans font-black">${item.banType === 'permanent' ? 'Blacklist Permanen' : 'DiBlacklist'}</span>
                            </div>
                            <p class="text-[11px] text-white/80 font-medium">${item.banReason}</p>
                            <span class="text-[10px] text-white/40 font-mono block">Masa Berlaku: ${expText} ${item.banDurationText ? '(' + item.banDurationText + ')' : ''}</span>
                        </div>
                        <button onclick="Profile.quickUnbanIp('${item.ip}')" class="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer shadow-md">
                            <i data-lucide="unlock" class="w-3.5 h-3.5 text-emerald-400"></i>
                            <span>Buka IP</span>
                        </button>
                    </div>`;
                }).join('');
            }

            var html = `
            <div class="space-y-5">
                <!-- Header Info Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-purple-500/10 border border-rose-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
                            <i data-lucide="shield-alert" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">Form Atur Sanksi & Ban Pengguna</h3>
                            <p class="text-xs text-white/60">Pengelolaan Ban Akun (Username/Email/ID) dan Ban IP Address (Blacklist Jaringan) secara terpisah</p>
                        </div>
                    </div>
                    <div class="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                        <i data-lucide="shield" class="w-3.5 h-3.5"></i>
                        <span>${totalSanctioned} Dalam Sanksi</span>
                    </div>
                </div>

                <!-- Stats Counters Pills -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-white/50 block font-medium">Aktif Bebas Sanksi</span>
                            <span class="text-base font-black text-emerald-400">${activeCount}</span>
                        </div>
                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400/50"></i>
                    </div>

                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-white/50 block font-medium">Banned</span>
                            <span class="text-base font-black text-amber-400">${tempBanCount}</span>
                        </div>
                        <i data-lucide="clock" class="w-5 h-5 text-amber-400/50"></i>
                    </div>

                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-white/50 block font-medium">Banned Permanen</span>
                            <span class="text-base font-black text-rose-400">${permBanCount}</span>
                        </div>
                        <i data-lucide="ban" class="w-5 h-5 text-rose-400/50"></i>
                    </div>

                    <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-white/50 block font-medium">Blacklist IP Aktif</span>
                            <span class="text-base font-black text-red-400">${bannedIpsList.length}</span>
                        </div>
                        <i data-lucide="wifi-off" class="w-5 h-5 text-red-400/50"></i>
                    </div>
                </div>

                <!-- MAIN FORM CONTAINER -->
                <div class="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
                    <div class="border-b border-white/10 pb-2">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <i data-lucide="user-check" class="w-4 h-4"></i>
                            <span>1. Target Pengguna Atau IP Address (Isi Salah Satu Saja)</span>
                        </h4>
                        <p class="text-[11px] text-white/50 mt-0.5">Isi User ID / Username / Email untuk Ban Akun spesifik. Isi Alamat IP saja untuk Blacklist IP Jaringan terpisah.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <!-- Field 0: User ID -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-white/80 flex items-center gap-1">
                                <i data-lucide="fingerprint" class="w-3.5 h-3.5 text-amber-400"></i> User ID
                            </label>
                            <input id="admin-ban-form-userid" type="text" oninput="Profile.onBanFormInput('userid')" placeholder="Contoh: u_172..." class="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all font-mono">
                        </div>

                        <!-- Field 1: Username -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-white/80 flex items-center gap-1">
                                <i data-lucide="user" class="w-3.5 h-3.5 text-sky-400"></i> Username
                            </label>
                            <input id="admin-ban-form-username" type="text" oninput="Profile.onBanFormInput('username')" placeholder="Contoh: nabil" class="w-full bg-white/5 border border-white/10 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all">
                        </div>

                        <!-- Field 2: Email -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-white/80 flex items-center gap-1">
                                <i data-lucide="mail" class="w-3.5 h-3.5 text-purple-400"></i> Email
                            </label>
                            <input id="admin-ban-form-email" type="email" oninput="Profile.onBanFormInput('email')" placeholder="Contoh: nabil@gmail.com" class="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all">
                        </div>

                        <!-- Field 3: IP Address -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-white/80 flex items-center gap-1">
                                <i data-lucide="globe" class="w-3.5 h-3.5 text-red-400"></i> Alamat IP Jaringan
                            </label>
                            <input id="admin-ban-form-ip" type="text" oninput="Profile.onBanFormInput('ip')" placeholder="Contoh: 114.10... / 2402:..." class="w-full bg-white/5 border border-white/10 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all font-mono">
                        </div>
                    </div>

                    <!-- Helper Active Target Status Bar -->
                    <div id="admin-ban-form-target-status" class="hidden text-[11px] p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold flex items-center gap-2">
                        <i data-lucide="info" class="w-4 h-4 shrink-0"></i>
                        <span id="admin-ban-form-target-status-text">Target dipilih.</span>
                    </div>

                    <div class="border-t border-white/10 pt-3 space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i>
                            <span>2. Atur Jenis Sanksi & Pesan Alasan</span>
                        </h4>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <!-- Jenis Sanksi Select -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-white/80">Pilih Jenis Sanksi / Status Akun</label>
                                <select id="admin-ban-form-type" onchange="Profile.toggleBanFormDurationInput()" class="w-full bg-black/60 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium">
                                    <option value="none">Buka Banned</option>
                                    <option value="permanent" selected>Banned Permanen</option>
                                    <option value="temporary">Banned Durasi Waktu</option>
                                    <option value="warning">Peringatan Saja</option>
                                </select>
                            </div>

                            <!-- Durasi Blokir Sementara Select -->
                            <div id="admin-ban-form-duration-container" class="space-y-1.5 hidden">
                                <label class="text-xs font-bold text-white/80">Pilih Durasi Banned</label>
                                <select id="admin-ban-form-duration" class="w-full bg-black/60 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium">
                                    <option value="1">1Hari 24Jam</option>
                                    <option value="5" selected>5Hari</option>
                                    <option value="7">7Hari</option>
                                    <option value="10">10Hari</option>
                                    <option value="20">20Hari</option>
                                    <option value="30">1Bulan 30Hari</option>
                                    <option value="60">2Bulan 60Hari</option>
                                    <option value="365">1Tahun 365Hari</option>
                                    <option value="730">2Tahun 730Hari</option>
                                    <option value="1095">3Tahun 1095Hari</option>
                                    <option value="1460">4Tahun 1460Hari</option>
                                    <option value="1825">5Tahun 1825Hari</option>
                                    <option value="3650">10Tahun 3650Hari</option>
                                    <option value="10950">30Tahun 10950Hari</option>
                                    <option value="14600">40Tahun 14600Hari</option>
                                    <option value="18250">50Tahun 18250Hari</option>
                                    <option value="32850">90Tahun 32850Hari</option>
                                    <option value="36500">100Tahun 36500Hari</option>
                                </select>
                            </div>
                        </div>

                        <!-- Teks Pesan Peringatan / Alasan Blokir -->
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-white/80">Teks Pesan Peringatan / Alasan Banned Ditampilkan ke Pengguna</label>
                            <textarea id="admin-ban-form-reason" rows="3" placeholder="Tulis alasan atau pesan peringatan yang akan muncul di layar pengguna (misal: Akun/IP Anda dibanned karena pelanggaran ketentuan)..." class="w-full bg-black/60 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all leading-relaxed font-sans">Akun atau Alamat IP Anda telah dibanned oleh administrator karena adanya pelanggaran ketentuan.</textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-2 pt-2">
                            <button id="admin-submit-ban-btn" onclick="Profile.submitBanForm(false)" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer">
                                <i data-lucide="shield-alert" class="w-4 h-4"></i>
                                <span>Terapkan Sanksi Banned</span>
                            </button>

                            <button id="admin-submit-unban-btn" onclick="Profile.submitBanForm(true)" class="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                                <span>Buka Banned / Unban Target</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- SECTION 2: BLACKLIST IP ADDRESS LIST -->
                <div class="p-5 rounded-2xl bg-black/40 border border-red-500/20 space-y-3.5 shadow-xl">
                    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                            <i data-lucide="wifi-off" class="w-4 h-4"></i>
                            <span>Daftar Blacklist IP Address (${bannedIpsList.length})</span>
                        </h4>
                        <span class="text-[10px] text-white/40">Sistem memblokir jaringan dari IP ini</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        ${ipListHtml}
                    </div>
                </div>

                <!-- SECTION 3: USERS LIST & SEARCH -->
                <div class="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3.5 shadow-xl">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                            <i data-lucide="users" class="w-4 h-4"></i>
                            <span>Daftar Akun Pengguna & Status Sanksi (${users.length})</span>
                        </h4>
                        <div class="relative w-full sm:w-64">
                            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"></i>
                            <input id="admin-ban-search-input" type="text" oninput="Profile.filterAdminBansList()" placeholder="Cari username, email, IP..." class="w-full bg-white/5 border border-white/10 focus:border-sky-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div id="admin-bans-cards-list" class="space-y-3">
                        ${Profile.renderUserBanCardsHtml(users)}
                    </div>
                </div>
            </div>`;

            container.innerHTML = html;

            if (window.lucide) lucide.createIcons();
            if (typeof Auth !== 'undefined' && typeof Auth.syncVerifiedBadges === 'function') {
                Auth.syncVerifiedBadges();
            }
        } catch (e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="wifi-off" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Terjadi kesalahan saat memuat data sanksi: ${e.message}</p>
            </div>`;
            if (window.lucide) lucide.createIcons();
        }
    },

    onBanFormInput(type) {
        var idEl = gid('admin-ban-form-userid');
        var uEl = gid('admin-ban-form-username');
        var eEl = gid('admin-ban-form-email');
        var ipEl = gid('admin-ban-form-ip');
        var statusBox = gid('admin-ban-form-target-status');
        var statusText = gid('admin-ban-form-target-status-text');

        if (type === 'userid') {
            var idVal = idEl ? idEl.value.trim() : '';
            if (idVal) {
                if (uEl) uEl.value = '';
                if (eEl) eEl.value = '';
                if (ipEl) ipEl.value = '';
                if (statusBox && statusText) {
                    statusText.innerText = '✓ Target User ID terisi: "' + idVal + '" Username, Email & IP tidak perlu diisi';
                    statusBox.classList.remove('hidden');
                }
            } else {
                if (statusBox) statusBox.classList.add('hidden');
            }
        } else if (type === 'username') {
            var uVal = uEl ? uEl.value.trim() : '';
            if (uVal) {
                if (idEl) idEl.value = '';
                if (eEl) eEl.value = '';
                if (ipEl) ipEl.value = '';
                if (statusBox && statusText) {
                    statusText.innerText = '✓ Target Username terisi: "@' + uVal + '" User ID, Email & IP tidak perlu diisi';
                    statusBox.classList.remove('hidden');
                }
            } else {
                if (statusBox) statusBox.classList.add('hidden');
            }
        } else if (type === 'email') {
            var eVal = eEl ? eEl.value.trim() : '';
            if (eVal) {
                if (idEl) idEl.value = '';
                if (uEl) uEl.value = '';
                if (ipEl) ipEl.value = '';
                if (statusBox && statusText) {
                    statusText.innerText = '✓ Target Email terisi: "' + eVal + '" User ID, Username & IP tidak perlu diisi';
                    statusBox.classList.remove('hidden');
                }
            } else {
                if (statusBox) statusBox.classList.add('hidden');
            }
        } else if (type === 'ip') {
            var ipVal = ipEl ? ipEl.value.trim() : '';
            if (ipVal) {
                if (idEl) idEl.value = '';
                if (uEl) uEl.value = '';
                if (eEl) eEl.value = '';
                if (statusBox && statusText) {
                    statusText.innerText = '✓ Target Alamat IP terisi: "' + ipVal + '" User ID, Username & Email tidak perlu diisi';
                    statusBox.classList.remove('hidden');
                }
            } else {
                if (statusBox) statusBox.classList.add('hidden');
            }
        }
    },

    selectUserForBanForm(username, email, lastIp, id) {
        var idEl = gid('admin-ban-form-userid');
        var uEl = gid('admin-ban-form-username');
        var eEl = gid('admin-ban-form-email');
        var ipEl = gid('admin-ban-form-ip');

        if (idEl) idEl.value = id || '';
        if (uEl) uEl.value = '';
        if (eEl) eEl.value = '';
        if (ipEl) ipEl.value = '';

        Profile.onBanFormInput('userid');

        if (idEl) {
            idEl.focus();
            idEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    selectIpForBanForm(ip) {
        var idEl = gid('admin-ban-form-userid');
        var uEl = gid('admin-ban-form-username');
        var eEl = gid('admin-ban-form-email');
        var ipEl = gid('admin-ban-form-ip');

        if (idEl) idEl.value = '';
        if (uEl) uEl.value = '';
        if (eEl) eEl.value = '';
        if (ipEl) ipEl.value = ip || '';

        Profile.onBanFormInput('ip');

        if (ipEl) {
            ipEl.focus();
            ipEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    showConfirmModal(options) {
        var existing = gid('profile-custom-confirm-modal');
        if (existing) existing.remove();

        var title = options.title || 'Konfirmasi Terapkan Sanksi';
        var message = options.message || 'Apakah Anda yakin ingin melanjutkan aksi ini?';
        var confirmText = options.confirmText || 'Ya, Lanjutkan';
        var confirmClass = options.confirmClass || 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600';
        var onConfirm = options.onConfirm;

        var modal = document.createElement('div');
        modal.id = 'profile-custom-confirm-modal';
        modal.className = 'fixed inset-0 z-[2000000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn pointer-events-auto';
        modal.innerHTML = `
            <div class="bg-[#12141c]/95 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center space-y-4 shadow-2xl shadow-black/90 transform scale-100 transition-all">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <i data-lucide="shield-alert" class="w-6 h-6"></i>
                </div>
                <div class="space-y-1.5">
                    <h3 class="text-sm sm:text-base font-bold text-white tracking-tight">${title}</h3>
                    <p class="text-xs text-white/70 leading-relaxed font-medium">${message}</p>
                </div>
                <div class="flex items-center gap-2 pt-2">
                    <button onclick="gid('profile-custom-confirm-modal')?.remove()" class="flex-1 py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-bold text-xs border border-white/10 active:scale-95 transition-all cursor-pointer">
                        Batal
                    </button>
                    <button id="profile-modal-confirm-btn" class="flex-1 py-3 px-3 rounded-xl ${confirmClass} text-white font-bold text-xs active:scale-95 transition-all cursor-pointer shadow-lg">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        modal.onclick = function(e) {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }

        var btn = gid('profile-modal-confirm-btn');
        if (btn) {
            btn.onclick = async function() {
                btn.disabled = true;
                btn.classList.add('opacity-70');
                try {
                    if (typeof onConfirm === 'function') {
                        await onConfirm();
                    }
                } finally {
                    modal.remove();
                }
            };
        }
    },

    async quickBanUserIp(targetIp, username) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login admin kembali.');
            return;
        }

        var cleanIp = (targetIp || '').trim();

        if (!cleanIp || cleanIp.includes('***')) {
            Profile.selectIpForBanForm(cleanIp);
            if (typeof showToast === 'function') showToast('Alamat IP tersensor. Silakan masukkan IP penuh di Form!');
            return;
        }

        Profile.showConfirmModal({
            title: 'Blacklist Alamat IP',
            message: 'Apakah Anda yakin ingin memasukkan Alamat IP "' + cleanIp + '" (Pengguna: @' + username + ') ke dalam Blacklist IP?',
            confirmText: 'Ya, Blacklist IP',
            confirmClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30',
            onConfirm: async function() {
                try {
                    var res = await fetch('/api/user-auth?action=admin_ban_ip', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': token
                        },
                        body: JSON.stringify({
                            targetIp: cleanIp,
                            banType: 'permanent',
                            banReason: 'Alamat IP Anda telah dimasukkan ke dalam daftar hitam (blacklist) oleh admin.'
                        })
                    });
                    var data = await res.json();
                    if (data.status) {
                        if (typeof showToast === 'function') {
                            showToast(data.message || 'IP ' + cleanIp + ' berhasil di-blacklist!');
                        }
                        Profile.loadAdminBansList();
                        Profile.loadAdminUsersList();
                    } else {
                        if (typeof showToast === 'function') {
                            showToast(data.message || 'Gagal mem-blacklist IP');
                        }
                    }
                } catch(e) {
                    if (typeof showToast === 'function') {
                        showToast('Terjadi kesalahan koneksi');
                    }
                }
            }
        });
    },

    confirmAdminDeleteUser(userId, username, email) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login kembali.');
            return;
        }
        Profile.showConfirmModal({
            title: 'Hapus Akun Pengguna Permanen',
            message: 'Apakah Anda yakin ingin MENGHAPUS PERMANEN akun @' + (username || '') + (email ? ' (' + email + ')' : '') + '? Akun beserta status sanksi/banned-nya akan langsung dihapus selamanya dari sistem database.',
            confirmText: 'Ya, Hapus Permanen',
            confirmClass: 'bg-red-600 hover:bg-red-700 shadow-red-500/40',
            onConfirm: async function() {
                await Profile.executeAdminDeleteUser(userId, username, email);
            }
        });
    },

    async executeAdminDeleteUser(userId, username, email) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login kembali.');
            return;
        }
        try {
            var res = await fetch('/api/user-auth?action=admin_delete_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    targetId: userId,
                    userId: userId,
                    id: userId,
                    username: username,
                    email: email
                })
            });
            var data = await res.json();
            if (data && data.status) {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Akun @' + (username || '') + ' berhasil dihapus permanen');
                }
                gid('admin-ban-config-modal')?.remove();
                Profile.loadAdminUsersList();
                Profile.loadAdminBansList();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data?.message || 'Gagal menghapus akun pengguna');
                }
            }
        } catch (err) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan jaringan saat menghapus pengguna');
            }
        }
    },

    toggleBanFormDurationInput() {
        var typeEl = gid('admin-ban-form-type');
        var durContainer = gid('admin-ban-form-duration-container');
        if (!typeEl || !durContainer) return;
        if (typeEl.value === 'temporary') {
            durContainer.classList.remove('hidden');
        } else {
            durContainer.classList.add('hidden');
        }
    },

    async submitBanForm(isUnban) {
        var token = Profile.getAdminToken();
        if (!token) return;

        var idVal = (gid('admin-ban-form-userid')?.value || '').trim();
        var uVal = (gid('admin-ban-form-username')?.value || '').trim();
        var eVal = (gid('admin-ban-form-email')?.value || '').trim();
        var ipVal = (gid('admin-ban-form-ip')?.value || '').trim();

        if (!idVal && !uVal && !eVal && !ipVal) {
            if (typeof showToast === 'function') {
                showToast('Silakan isi salah satu target: User ID, Username, Email, atau Alamat IP!');
            }
            return;
        }

        var banType = isUnban ? 'none' : (gid('admin-ban-form-type')?.value || 'permanent');
        var durationDays = Number(gid('admin-ban-form-duration')?.value || 0);
        var banReason = isUnban ? '' : (gid('admin-ban-form-reason')?.value || '').trim();

        var submitBtn = isUnban ? gid('admin-submit-unban-btn') : gid('admin-submit-ban-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50');
        }

        try {
            // Handle IP-only Banning separately
            if (ipVal && !idVal && !uVal && !eVal) {
                var resIp = await fetch('/api/user-auth?action=admin_ban_ip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-token': token
                    },
                    body: JSON.stringify({
                        targetIp: ipVal,
                        banType: banType,
                        durationDays: durationDays,
                        banReason: banReason || 'Alamat IP Anda telah dimasukkan ke dalam daftar hitam oleh admin.'
                    })
                });
                var dataIp = await resIp.json();
                if (dataIp.status) {
                    if (typeof showToast === 'function') {
                        showToast(dataIp.message || 'Blacklist IP berhasil diperbarui!');
                    }
                    if (gid('admin-ban-form-ip')) gid('admin-ban-form-ip').value = '';
                    gid('admin-ban-form-target-status')?.classList.add('hidden');
                    Profile.loadAdminBansList();
                    Profile.loadAdminUsersList();
                } else {
                    if (typeof showToast === 'function') {
                        showToast(dataIp.message || 'Gagal memperbarui sanksi IP');
                    }
                }
                return;
            }

            // Otherwise handle User Account Banning
            var res = await fetch('/api/user-auth?action=admin_ban_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    targetId: idVal,
                    username: uVal,
                    email: eVal,
                    ip: ipVal,
                    banType: banType,
                    durationDays: durationDays,
                    banReason: banReason
                })
            });
            var data = await res.json();

            // Also ban IP address if provided alongside user
            if (ipVal && !isUnban) {
                await fetch('/api/user-auth?action=admin_ban_ip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-token': token
                    },
                    body: JSON.stringify({
                        targetIp: ipVal,
                        banType: banType,
                        durationDays: durationDays,
                        banReason: banReason || 'Alamat IP Anda telah dimasukkan ke dalam daftar hitam oleh admin.'
                    })
                });
            }

            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Status sanksi akun berhasil diperbarui!');
                }
                if (gid('admin-ban-form-userid')) gid('admin-ban-form-userid').value = '';
                if (gid('admin-ban-form-username')) gid('admin-ban-form-username').value = '';
                if (gid('admin-ban-form-email')) gid('admin-ban-form-email').value = '';
                if (gid('admin-ban-form-ip')) gid('admin-ban-form-ip').value = '';
                gid('admin-ban-form-target-status')?.classList.add('hidden');

                Profile.loadAdminBansList();
                Profile.loadAdminUsersList();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal menerapkan sanksi');
                }
            }
        } catch(e) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan koneksi');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50');
            }
        }
    },

    renderUserBanCardsHtml(users) {
        if (!users || users.length === 0) return '';

        return users.map(function(u) {
            var banStatus = u.banStatus || { isBanned: false, isWarning: false, banType: 'none', banReason: '' };
            var statusBadgeHtml = '';

            if (banStatus.isBanned) {
                if (u.banType === 'permanent') {
                    statusBadgeHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> Banned Permanen</span>`;
                } else {
                    statusBadgeHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Banned</span>`;
                }
            } else if (banStatus.isWarning || u.banType === 'warning') {
                statusBadgeHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Banner Peringatan</span>`;
            } else {
                statusBadgeHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Aktif</span>`;
            }

            var unbanBtnHtml = '';
            if (u.banType && u.banType !== 'none') {
                unbanBtnHtml = `
                <button onclick="Profile.quickUnbanUser('${u.id}', '${u.username}')" class="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md shadow-emerald-500/10">
                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>Buka Banned</span>
                </button>`;
            }

            return `
            <div class="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2.5 shadow-lg">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div class="flex items-center gap-3">
                        <img src="${u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.username}" class="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/15 shrink-0" alt="${u.username}">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="text-xs font-bold text-white truncate flex items-center gap-1">
                                    <span>${u.username}</span>
                                    <span class="global-verified-badge-container inline-flex items-center"></span>
                                </h4>
                                ${statusBadgeHtml}
                            </div>
                            <p class="text-[11px] text-white/60 truncate flex items-center gap-1 mt-0.5">
                                <span>${u.email}</span>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0 flex-wrap">
                        <button onclick="Profile.selectUserForBanForm('${esJs(u.username)}', '${esJs(u.email)}', '${esJs(u.lastIp)}', '${esJs(u.id)}')" class="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center gap-1 active:scale-95 transition-all cursor-pointer">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                            <span>Pilih Akun</span>
                        </button>
                        <button onclick="Profile.quickBanUserIp('${esJs(u.rawLastIp || u.lastIp)}', '${esJs(u.username)}')" class="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1 active:scale-95 transition-all cursor-pointer" title="Ban Alamat IP penguna ini">
                            <i data-lucide="wifi-off" class="w-3.5 h-3.5 text-red-400"></i>
                            <span>Blacklist IP</span>
                        </button>
                        <button onclick="Profile.confirmAdminDeleteUser('${esJs(u.id)}', '${esJs(u.username)}', '${esJs(u.email)}')" class="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-md" title="Hapus Akun Pengguna Secara Permanen">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i>
                            <span>Hapus Akun</span>
                        </button>
                        ${unbanBtnHtml}
                    </div>
                </div>

                <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                    <div class="flex items-center justify-between text-[11px]">
                        <span class="text-white/40 font-bold">IP TERAKHIR:</span>
                        ${Profile.formatIpDisplay(u.lastIp)}
                    </div>
                    <div class="pt-1.5 border-t border-white/10 text-[11px] font-mono text-amber-300/90 truncate flex items-center justify-between">
                        <span class="text-white/40 font-bold font-sans">USER ID:</span>
                        <span onclick="navigator.clipboard.writeText('${u.id}'); if(typeof showToast==='function') showToast('ID disalin: ${u.id}');" class="cursor-pointer hover:underline flex items-center gap-1" title="Klik untuk Salin User ID">
                            <i data-lucide="fingerprint" class="w-3 h-3 text-amber-400"></i> ${u.id}
                        </span>
                    </div>
                </div>

                ${u.banReason ? `
                <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 flex items-start gap-2">
                    <i data-lucide="info" class="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5"></i>
                    <div>
                        <span class="font-bold block text-[10px] uppercase text-rose-300">Pesan Alasan Aktif:</span>
                        <p class="mt-0.5 font-medium leading-normal">${u.banReason}</p>
                    </div>
                </div>` : ''}
            </div>`;
        }).join('');
    },

    filterAdminBansList() {
        var input = gid('admin-ban-search-input');
        var query = (input ? input.value : '').trim().toLowerCase();
        var users = Profile.cachedAdminUsers || [];
        var cardsContainer = gid('admin-bans-cards-list');
        if (!cardsContainer) return;

        var filtered = users.filter(function(u) {
            if (!query) return true;
            var uname = (u.username || '').toLowerCase();
            var email = (u.email || '').toLowerCase();
            var lastIp = (u.lastIp || '').toLowerCase();
            var logsMatch = (u.loginLogs || []).some(function(l) {
                return (l.ip || '').toLowerCase().includes(query);
            });
            return uname.includes(query) || email.includes(query) || lastIp.includes(query) || logsMatch;
        });

        if (filtered.length === 0) {
            cardsContainer.innerHTML = `
            <div class="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/50 text-xs space-y-2">
                <i data-lucide="search-x" class="w-8 h-8 mx-auto text-white/30"></i>
                <p class="font-bold text-white/80">Pengguna Tidak Ditemukan</p>
                <p class="text-[11px] text-white/40">Tidak ada pengguna yang cocok dengan pencarian "${query}".</p>
            </div>`;
            if (window.lucide) lucide.createIcons();
            return;
        }

        cardsContainer.innerHTML = Profile.renderUserBanCardsHtml(filtered);
        if (window.lucide) lucide.createIcons();
        if (typeof Auth !== 'undefined' && typeof Auth.syncVerifiedBadges === 'function') {
            Auth.syncVerifiedBadges();
        }
    },

    async quickUnbanUser(userId, username) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login admin kembali.');
            return;
        }

        Profile.showConfirmModal({
            title: 'Buka Banned Akun',
            message: 'Apakah Anda yakin ingin membuka status Banned akun @' + username + '?',
            confirmText: 'Ya, Buka Banned',
            confirmClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30',
            onConfirm: async function() {
                try {
                    var res = await fetch('/api/user-auth?action=admin_ban_user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': token
                        },
                        body: JSON.stringify({
                            userId: userId,
                            banType: 'none',
                            durationDays: 0,
                            banReason: ''
                        })
                    });
                    var data = await res.json();

                    if (data.status) {
                        if (typeof showToast === 'function') {
                            showToast('Banned akun @' + username + ' telah dibuka (Status Aktif)!');
                        }
                        Profile.loadAdminUsersList();
                        Profile.loadAdminBansList();
                    } else {
                        if (typeof showToast === 'function') {
                            showToast(data.message || 'Gagal membuka Banned');
                        }
                    }
                } catch(e) {
                    if (typeof showToast === 'function') {
                        showToast('Terjadi kesalahan koneksi');
                    }
                }
            }
        });
    },

    async quickUnbanIp(targetIp) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login admin kembali.');
            return;
        }

        Profile.showConfirmModal({
            title: 'Buka Blacklist IP',
            message: 'Apakah Anda yakin ingin menghapus Alamat IP "' + targetIp + '" dari daftar Blacklist IP?',
            confirmText: 'Ya, Buka Blacklist IP',
            confirmClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30',
            onConfirm: async function() {
                try {
                    var res = await fetch('/api/user-auth?action=admin_unban_ip', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': token
                        },
                        body: JSON.stringify({ targetIp: targetIp })
                    });
                    var data = await res.json();

                    if (data.status) {
                        if (typeof showToast === 'function') {
                            showToast('IP Address ' + targetIp + ' berhasil dihapus dari blacklist!');
                        }
                        Profile.loadAdminBansList();
                        Profile.loadAdminUsersList();
                    } else {
                        if (typeof showToast === 'function') {
                            showToast(data.message || 'Gagal membuka Banned IP');
                        }
                    }
                } catch(e) {
                    if (typeof showToast === 'function') {
                        showToast('Terjadi kesalahan koneksi');
                    }
                }
            }
        });
    },

    formatUserLocalDateTime(isoString) {
        if (!isoString) return 'Belum Pernah';
        try {
            var d = new Date(isoString);
            if (isNaN(d.getTime())) return isoString;
            return d.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(/\./g, ':') + ' WIB';
        } catch(e) {
            return isoString;
        }
    },

    openAdminBanModal(userId) {
        var users = Profile.cachedAdminUsers || [];
        var u = users.find(function(user) { return user.id === userId; });
        if (!u) return;

        var existing = gid('admin-ban-config-modal');
        if (existing) existing.remove();

        var banType = u.banType || 'none';
        var banReason = u.banReason || '';

        var modal = document.createElement('div');
        modal.id = 'admin-ban-config-modal';
        modal.className = 'fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn pointer-events-auto';
        modal.innerHTML = `
            <div class="relative w-full max-w-lg bg-[#12141c] border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left">
                <!-- Close Button -->
                <button onclick="gid('admin-ban-config-modal')?.remove()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition active:scale-95 cursor-pointer">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>

                <!-- Header -->
                <div class="flex items-center gap-3 pr-8">
                    <img src="${u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.username}" class="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/20" alt="${u.username}">
                    <div>
                        <h3 class="text-base font-bold text-white">Kelola Sanksi / Banned Pengguna</h3>
                        <p class="text-xs text-amber-300 font-semibold">@${u.username} &bull; ${u.email}</p>
                    </div>
                </div>

                <!-- Form -->
                <div class="space-y-3.5 pt-2 border-t border-white/10">
                    <!-- Jenis Sanksi Select -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80">Pilih Jenis Sanksi / Status Akun</label>
                        <select id="admin-ban-select-type" onchange="Profile.toggleBanDurationInput()" class="w-full bg-black/60 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium">
                            <option value="none" ${banType === 'none' ? 'selected' : ''}>Aktif Bebas Sanksi Buka Banned</option>
                            <option value="permanent" ${banType === 'permanent' ? 'selected' : ''}>Banned Permanen</option>
                            <option value="temporary" ${banType === 'temporary' ? 'selected' : ''}>Banned Durasi Waktu</option>
                            <option value="warning" ${banType === 'warning' ? 'selected' : ''}>Banner Peringatan Saja</option>
                        </select>
                    </div>

                    <!-- Preset Durasi (Untuk Blokir Sementara) -->
                    <div id="admin-ban-duration-container" class="space-y-1.5 ${banType === 'temporary' ? '' : 'hidden'}">
                        <label class="text-xs font-bold text-white/80">Pilih Durasi Banned</label>
                        <select id="admin-ban-duration-select" class="w-full bg-black/60 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium">
                            <option value="1">Hari 24Jam'</option>
                            <option value="5" selected>5Hari</option>
                            <option value="7">7Hari</option>
                            <option value="10">10Hari</option>
                            <option value="20">20Hari</option>
                            <option value="30">1 Bulan 30Hari</option>
                            <option value="60">2 Bulan 60Hari</option>
                            <option value="365">1 Tahun 365Hari</option>
                            <option value="730">2 Tahun 730Hari</option>
                            <option value="1095">3 Tahun 1095Hari</option>
                            <option value="1460">4 Tahun 1460Hari</option>
                            <option value="1825">5 Tahun 1825Hari</option>
                            <option value="3650">10Tahun 3650Hari</option>
                            <option value="10950">30Tahun 10950Hari/option>
                            <option value="14600">40Tahun 14600Har</option>
                            <option value="18250">50Tahun 18250Hari</option>
                            <option value="32850">90Tahun 32850Hari</option>
                            <option value="36500">100Tahun 36500Hari</option>
                        </select>
                    </div>

                    <!-- Pesan / Teks Alasan Blokir -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-white/80">Teks Pesan Peringatan / Alasan Banned Ditampilkan ke Pengguna</label>
                        <textarea id="admin-ban-reason-text" rows="3" placeholder="Tulis alasan atau pesan peringatan yang akan ditampilkan persis di tengah layar pengguna (misal: Akun Anda diban karena melakukan pelanggaran ketentuan)..." class="w-full bg-black/60 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all leading-relaxed font-sans">${banReason || 'Akun Anda telah diblokir atau diberikan peringatan oleh administrator karena adanya pelanggaran ketentuan.'}</textarea>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-2 pt-2">
                    <button id="admin-save-ban-btn" onclick="Profile.saveUserBan('${u.id}')" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer">
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                        <span>Simpan & Terapkan Sanksi</span>
                    </button>

                    <button type="button" onclick="Profile.confirmAdminDeleteUser('${esJs(u.id)}', '${esJs(u.username)}', '${esJs(u.email || '')}')" class="py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" title="Hapus akun permanen dari server">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        <span>Hapus Akun</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        if (window.lucide) lucide.createIcons();
    },

    toggleBanDurationInput() {
        var typeSelect = gid('admin-ban-select-type');
        var durContainer = gid('admin-ban-duration-container');
        if (!typeSelect || !durContainer) return;
        if (typeSelect.value === 'temporary') {
            durContainer.classList.remove('hidden');
        } else {
            durContainer.classList.add('hidden');
        }
    },

    async saveUserBan(userId) {
        var token = Profile.getAdminToken();
        if (!token) return;

        var typeEl = gid('admin-ban-select-type');
        var durEl = gid('admin-ban-duration-select');
        var reasonEl = gid('admin-ban-reason-text');
        var saveBtn = gid('admin-save-ban-btn');

        var banType = typeEl ? typeEl.value : 'none';
        var durationDays = durEl ? Number(durEl.value) : 0;
        var banReason = reasonEl ? reasonEl.value.trim() : '';

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Menyimpan...</span>';
            if (window.lucide) lucide.createIcons();
        }

        try {
            var res = await fetch('/api/user-auth?action=admin_ban_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    userId: userId,
                    banType: banType,
                    durationDays: durationDays,
                    banReason: banReason
                })
            });
            var data = await res.json();

            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast('Status sanksi pengguna berhasil diperbarui!');
                }
                gid('admin-ban-config-modal')?.remove();
                Profile.loadAdminUsersList();
                Profile.loadAdminBansList();
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Gagal menyimpan sanksi');
                }
            }
        } catch(e) {
            if (typeof showToast === 'function') {
                showToast('Terjadi kesalahan koneksi');
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> <span>Simpan & Terapkan Sanksi</span>';
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    deleteUserAccount(userId, username) {
        Profile.confirmAdminDeleteUser(userId, username);
    },

    // ==========================================
    // 9. DYNAMIC QRIS & PAYMENT CONFIGURATOR
    // ==========================================
    pendingQrisBase64: null,
    resetQrisFlag: false,
    cachedPaymentConfig: null,
    adminPaymentAccounts: [],

    async renderAdminPaymentTab(silent) {
        var container = gid('admin-payment-container');
        if (!container) return;

        if (!silent && (!container.innerHTML || container.innerHTML.includes('loader-2'))) {
            container.innerHTML = `
            <div class="text-center py-12 text-white/50 space-y-2">
                <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-amber-400"></i>
                <p class="text-xs">Memuat konfigurasi QRIS & Pembayaran...</p>
            </div>`;
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/payment-config?t=' + Date.now());
            var data = await res.json();
            var config = (data && data.status && data.config) ? data.config : {
                qrisUrl: '/qris.png',
                qrisFilename: 'QRIS-MusifyStar-Nabil.png',
                accounts: [
                    { bankName: 'SeaBank', accountNumber: '9012 3456 7890', accountHolder: 'NABIL (MusifyStar)', badge: 'Prioritas Bebas Admin', icon: 'credit-card' },
                    { bankName: 'DANA / GoPay', accountNumber: '0812 3456 7890', accountHolder: 'NABIL', badge: 'E-Wallet', icon: 'smartphone' }
                ],
                title: 'Dukung Pengembang MusifyStar',
                description: 'Donasi sukarela Anda sangat berharga untuk biaya sewa server & pengembangan fitur MusifyStar.',
                note: 'Semua dana donasi digunakan untuk perawatan server & penambahan fitur baru agar aplikasi tetap gratis tanpa iklan.'
            };

            Profile.cachedPaymentConfig = config;
            Profile.adminPaymentAccounts = JSON.parse(JSON.stringify(config.accounts || []));
            Profile.pendingQrisBase64 = null;
            Profile.resetQrisFlag = false;

            var accountsRows = Profile.getPaymentAccountsHtml();

            container.innerHTML = `
            <div class="space-y-4">
                <!-- Header Banner -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/25 shrink-0 font-bold">
                            <i data-lucide="qr-code" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-black text-white">Dynamic QRIS & Payment Configurator</h3>
                                <span class="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full font-mono">
                                    LIVE SYNC
                                </span>
                            </div>
                            <p class="text-xs text-white/60 mt-0.5">Ganti barcode QRIS donasi dan nomor rekening bank/e-wallet langsung dari dashboard tanpa edit kode.</p>
                        </div>
                    </div>
                </div>

                <!-- Form Konfigurasi -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
                    <div id="admin-payment-status" class="hidden p-3 rounded-xl text-xs flex items-center gap-2"></div>

                    <!-- BAGIAN 1: GAMBAR QRIS BARCODE -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="image" class="w-4 h-4 text-amber-400"></i>
                                <span>1. Gambar Barcode QRIS</span>
                            </label>
                            <span class="text-[11px] text-white/40">Mendukung PNG, JPG, WebP</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                            <!-- Live Preview Box -->
                            <div class="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/10">
                                <span class="text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Preview Gambar Aktif</span>
                                <div class="w-36 h-36 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                                    <img id="admin-qris-live-preview" src="${config.qrisUrl || '/qris.png'}" alt="Preview QRIS" class="w-full h-full object-contain rounded" onerror="this.src='/qris.png'" />
                                </div>
                                <span id="admin-qris-preview-label" class="text-[10px] text-amber-300 mt-2 font-mono truncate max-w-[140px]">
                                    ${config.qrisUrl ? 'QRIS Custom' : 'Default /qris.png'}
                                </span>
                            </div>

                            <!-- Upload & Action Controls -->
                            <div class="sm:col-span-2 space-y-3 flex flex-col justify-center">
                                <div>
                                    <input type="file" id="admin-qris-file-input" accept="image/png,image/jpeg,image/webp" onchange="Profile.handleQrisFileSelect(event)" class="hidden" />
                                    <button type="button" onclick="gid('admin-qris-file-input')?.click()" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer">
                                        <i data-lucide="upload" class="w-4 h-4"></i>
                                        <span>Unggah Gambar Barcode QRIS Baru Dari HP/PC</span>
                                    </button>
                                </div>

                                <div class="relative">
                                    <label class="block text-[11px] font-semibold text-white/50 mb-1">Atau masukkan link gambar QRIS (URL):</label>
                                    <input type="text" id="admin-qris-url-input" value="${config.qrisUrl || '/qris.png'}" placeholder="Contoh: /qris.png atau https://..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition-all shadow-inner" oninput="Profile.onQrisUrlInputChange(this.value)" />
                                </div>

                                <div class="pt-1 flex items-center gap-2">
                                    <button type="button" onclick="Profile.resetQrisDefault()" class="py-2 px-3 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/80 hover:text-white text-xs font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-rose-400"></i>
                                        <span>Reset ke QRIS Bawaan Asli (/qris.png)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BAGIAN 2: INFORMASI TEKS & CATATAN DONASI -->
                    <div class="space-y-3 pt-2 border-t border-white/10">
                        <label class="block text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="file-text" class="w-4 h-4 text-emerald-400"></i>
                            <span>2. Judul & Catatan Modal Donasi</span>
                        </label>

                        <div class="space-y-3">
                            <div>
                                <label class="block text-[11px] font-semibold text-white/60 mb-1">Judul Modal Donasi:</label>
                                <input type="text" id="admin-payment-title" value="${Profile.escapeHtml(config.title || 'Dukung Pengembang MusifyStar')}" placeholder="Dukung Pengembang MusifyStar" class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-all shadow-inner" />
                            </div>

                            <div>
                                <label class="block text-[11px] font-semibold text-white/60 mb-1">Deskripsi Donasi:</label>
                                <textarea id="admin-payment-desc" rows="2" placeholder="Tuliskan tujuan donasi..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-all shadow-inner leading-relaxed">${Profile.escapeHtml(config.description || '')}</textarea>
                            </div>

                            <div>
                                <label class="block text-[11px] font-semibold text-white/60 mb-1">Catatan Kaki (Info Server / Bebas Iklan):</label>
                                <textarea id="admin-payment-note" rows="2" placeholder="Catatan kaki..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-all shadow-inner leading-relaxed">${Profile.escapeHtml(config.note || '')}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- BAGIAN 3: NOMOR REKENING BANK & E-WALLET -->
                    <div class="space-y-3 pt-2 border-t border-white/10">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="credit-card" class="w-4 h-4 text-sky-400"></i>
                                <span>3. Nomor Rekening Bank & E-Wallet Donasi</span>
                            </label>
                            <button type="button" onclick="Profile.addPaymentAccountRow()" class="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                <span>+ Tambah Rekening</span>
                            </button>
                        </div>

                        <div id="admin-payment-accounts-list" class="space-y-2.5">
                            ${accountsRows}
                        </div>
                    </div>

                    <!-- TOMBOL SIMPAN -->
                    <div class="pt-3 border-t border-white/10 flex items-center justify-end">
                        <button type="button" id="admin-payment-save-btn" onclick="Profile.savePaymentConfig(event)" class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 active:scale-95 text-black font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                            <span>Simpan Konfigurasi QRIS & Rekening Donasi</span>
                        </button>
                    </div>
                </div>
            </div>`;

            lucide.createIcons();
        } catch (e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Gagal memuat konfigurasi pembayaran.</p>
            </div>`;
            lucide.createIcons();
        }
    },

    getPaymentAccountsHtml() {
        if (!Array.isArray(Profile.adminPaymentAccounts) || Profile.adminPaymentAccounts.length === 0) {
            return `
            <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/40">
                Belum ada rekening donasi yang dibuat. Klik tombol "+ Tambah Rekening" di atas.
            </div>`;
        }

        return Profile.adminPaymentAccounts.map(function(acc, idx) {
            return `
            <div class="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 relative group hover:border-amber-500/40 transition-all">
                <div class="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <i data-lucide="credit-card" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>Rekening #${idx + 1}</span>
                    </span>
                    <button type="button" onclick="Profile.removePaymentAccountRow(${idx})" class="p-1 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer" title="Hapus Rekening">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                        <label class="block text-[11px] text-white/50 mb-1">Nama Bank / E-Wallet:</label>
                        <input type="text" id="acc-bank-${idx}" value="${Profile.escapeHtml(acc.bankName || '')}" placeholder="SeaBank, BCA, DANA, GoPay" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition" />
                    </div>
                    <div>
                        <label class="block text-[11px] text-white/50 mb-1">Nomor Rekening / No. HP:</label>
                        <input type="text" id="acc-number-${idx}" value="${Profile.escapeHtml(acc.accountNumber || '')}" placeholder="9012 3456 7890" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-400 transition font-bold" />
                    </div>
                    <div>
                        <label class="block text-[11px] text-white/50 mb-1">Atas Nama (Holder):</label>
                        <input type="text" id="acc-holder-${idx}" value="${Profile.escapeHtml(acc.accountHolder || '')}" placeholder="NABIL (MusifyStar)" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition" />
                    </div>
                    <div>
                        <label class="block text-[11px] text-white/50 mb-1">Badge Keterangan:</label>
                        <input type="text" id="acc-badge-${idx}" value="${Profile.escapeHtml(acc.badge || '')}" placeholder="Prioritas Bebas Admin, E-Wallet" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition" />
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    handleQrisFileSelect(event) {
        var file = event.target.files && event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            if (typeof showToast === 'function') showToast('Pilih file gambar valid (PNG, JPG, WebP)');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            Profile.pendingQrisBase64 = e.target.result;
            Profile.resetQrisFlag = false;

            var previewImg = gid('admin-qris-live-preview');
            if (previewImg) previewImg.src = e.target.result;

            var label = gid('admin-qris-preview-label');
            if (label) label.innerText = 'Foto Baru Dipilih (' + Math.round(file.size / 1024) + ' KB)';

            var urlInp = gid('admin-qris-url-input');
            if (urlInp) urlInp.value = '[File Gambar Baru Siap Disimpan]';

            if (typeof showToast === 'function') {
                showToast('Gambar QRIS dipilih. Klik Simpan untuk menerapkan.');
            }
        };
        reader.readAsDataURL(file);
    },

    onQrisUrlInputChange(val) {
        if (!val || val.startsWith('[File')) return;
        Profile.pendingQrisBase64 = null;
        Profile.resetQrisFlag = false;
        var previewImg = gid('admin-qris-live-preview');
        if (previewImg) previewImg.src = val;
        var label = gid('admin-qris-preview-label');
        if (label) label.innerText = 'Custom URL';
    },

    resetQrisDefault() {
        Profile.resetQrisFlag = true;
        Profile.pendingQrisBase64 = null;
        var previewImg = gid('admin-qris-live-preview');
        if (previewImg) previewImg.src = '/qris.png';
        var label = gid('admin-qris-preview-label');
        if (label) label.innerText = 'Default /qris.png';
        var urlInp = gid('admin-qris-url-input');
        if (urlInp) urlInp.value = '/qris.png';
        if (typeof showToast === 'function') {
            showToast('QRIS diatur ke bawaan asli (/qris.png)');
        }
    },

    addPaymentAccountRow() {
        Profile.syncPaymentAccountsFromDom();
        Profile.adminPaymentAccounts.push({
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            badge: 'Bebas Admin'
        });
        var container = gid('admin-payment-accounts-list');
        if (container) {
            container.innerHTML = Profile.getPaymentAccountsHtml();
            lucide.createIcons();
        }
    },

    removePaymentAccountRow(idx) {
        Profile.syncPaymentAccountsFromDom();
        Profile.adminPaymentAccounts.splice(idx, 1);
        var container = gid('admin-payment-accounts-list');
        if (container) {
            container.innerHTML = Profile.getPaymentAccountsHtml();
            lucide.createIcons();
        }
    },

    syncPaymentAccountsFromDom() {
        if (!Array.isArray(Profile.adminPaymentAccounts)) return;
        Profile.adminPaymentAccounts.forEach(function(acc, idx) {
            var b = gid(`acc-bank-${idx}`);
            var n = gid(`acc-number-${idx}`);
            var h = gid(`acc-holder-${idx}`);
            var bg = gid(`acc-badge-${idx}`);
            if (b) acc.bankName = b.value.trim();
            if (n) acc.accountNumber = n.value.trim();
            if (h) acc.accountHolder = h.value.trim();
            if (bg) acc.badge = bg.value.trim();
        });
    },

    async savePaymentConfig(event) {
        if (event && event.preventDefault) event.preventDefault();
        var token = Profile.getAdminToken();
        if (!token) return;

        Profile.syncPaymentAccountsFromDom();

        var title = (gid('admin-payment-title')?.value || '').trim();
        var desc = (gid('admin-payment-desc')?.value || '').trim();
        var note = (gid('admin-payment-note')?.value || '').trim();
        var urlInput = (gid('admin-qris-url-input')?.value || '').trim();
        var statusBox = gid('admin-payment-status');
        var saveBtn = gid('admin-payment-save-btn');

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.classList.add('opacity-70');
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Menyimpan Konfigurasi...</span>';
            lucide.createIcons();
        }

        var payload = {
            title: title || 'Dukung Pengembang MusifyStar',
            description: desc,
            note: note,
            accounts: Profile.adminPaymentAccounts.filter(function(a){ return a.bankName || a.accountNumber; })
        };

        if (Profile.resetQrisFlag) {
            payload.resetDefault = true;
        } else if (Profile.pendingQrisBase64) {
            payload.qrisBase64 = Profile.pendingQrisBase64;
        } else if (urlInput && !urlInput.startsWith('[File')) {
            payload.qrisUrl = urlInput;
        }

        try {
            var res = await fetch('/api/payment-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify(payload)
            });
            var data = await res.json();

            if (data.status) {
                Profile.cachedPaymentConfig = data.config;
                Profile.pendingQrisBase64 = null;
                Profile.resetQrisFlag = false;

                if (typeof showToast === 'function') {
                    showToast('Konfigurasi QRIS & Rekening Donasi berhasil diperbarui!');
                }

                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
                    statusBox.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i><span>Konfigurasi QRIS & Rekening Donasi berhasil disimpan dan langsung aktif di aplikasi!</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }

                Profile.renderAdminPaymentTab(true);
            } else {
                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                    statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>' + (data.message || 'Gagal menyimpan konfigurasi') + '</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }
            }
        } catch(e) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="wifi-off" class="w-4 h-4 shrink-0"></i><span>Koneksi bermasalah saat menyimpan.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.classList.remove('opacity-70');
                saveBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i><span>Simpan Konfigurasi QRIS & Rekening Donasi</span>';
                lucide.createIcons();
            }
        }
    },

    // ==========================================
    // 10. DIRECT USER MESSAGING (ADMIN TO USER)
    // ==========================================
    adminMsgRecipientMode: 'user',
    adminRegisteredUsers: [],

    async renderAdminMessagesTab(silent) {
        var container = gid('admin-messages-container');
        if (!container) return;

        if (!silent && (!container.innerHTML || container.innerHTML.includes('loader-2'))) {
            container.innerHTML = `
            <div class="text-center py-12 text-white/50 space-y-2">
                <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-emerald-400"></i>
                <p class="text-xs">Memuat modul pesan & daftar pengguna...</p>
            </div>`;
            lucide.createIcons();
        }

        var token = Profile.getAdminToken();
        if (!token) return;

        try {
            // Ambil daftar user terdaftar dan riwayat pesan
            var [usersRes, msgsRes] = await Promise.all([
                fetch('/api/user-auth?action=admin_get_users', { headers: { 'x-admin-token': token } }),
                fetch('/api/messages?action=admin_list', { headers: { 'x-admin-token': token } })
            ]);

            var usersData = await usersRes.json().catch(function() { return { status: false }; });
            var msgsData = await msgsRes.json().catch(function() { return { status: false }; });

            var users = (usersData && usersData.status && Array.isArray(usersData.users)) ? usersData.users : (Array.isArray(Profile.cachedAdminUsers) ? Profile.cachedAdminUsers : []);
            var sentMessages = (msgsData && msgsData.status && Array.isArray(msgsData.messages)) ? msgsData.messages : [];
            Profile.adminRegisteredUsers = users;
            Profile.cachedAdminUsers = users;

            var userOptionsHtml = users.map(function(u) {
                var disp = '@' + u.username + ' (' + (u.email || 'Tanpa Email') + ')';
                return `<option value="${Profile.escapeHtml(u.id)}" data-username="${Profile.escapeHtml(u.username)}">${disp}</option>`;
            }).join('');

            var historyHtml = '';
            if (sentMessages.length > 0) {
                historyHtml = sentMessages.map(function(m) {
                    var dateStr = new Date(m.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                    var priorityBadge = '';
                    if (m.priority === 'warning') priorityBadge = '<span class="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold">PERINGATAN</span>';
                    else if (m.priority === 'important') priorityBadge = '<span class="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">PENTING</span>';
                    else if (m.priority === 'vip') priorityBadge = '<span class="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">VIP</span>';
                    else priorityBadge = '<span class="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded font-bold">INFO</span>';

                    var recBadge = m.recipientType === 'all'
                        ? '<span class="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i> Semua Pengguna (Broadcast)</span>'
                        : '<span class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i> @' + Profile.escapeHtml(m.recipientName || m.recipientId) + '</span>';

                    return `
                    <div class="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 flex-wrap">
                                ${recBadge}
                                ${priorityBadge}
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] text-white/40">${dateStr}</span>
                                <button type="button" onclick="Profile.deleteAdminMessage('${esJs(m.id)}')" class="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer" title="Hapus Pesan">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                        </div>
                        <h5 class="text-xs sm:text-sm font-bold text-white tracking-wide">${Profile.escapeHtml(m.title)}</h5>
                        <p class="text-xs text-white/70 whitespace-pre-wrap leading-relaxed">${Profile.escapeHtml(m.body)}</p>
                        ${m.actionUrl ? `
                        <div class="pt-1">
                            <span class="text-[11px] text-cyan-400/80 font-mono truncate block">Tautan: ${Profile.escapeHtml(m.actionUrl)}</span>
                        </div>` : ''}
                    </div>`;
                }).join('');
            } else {
                historyHtml = '<p class="text-xs text-white/50 text-center py-8">Belum ada riwayat pesan yang dikirim oleh admin.</p>';
            }

            container.innerHTML = `
            <div class="space-y-4">
                <!-- Header Banner -->
                <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
                            <i data-lucide="send" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-black text-white">Direct User Messaging (Admin ke Pengguna)</h3>
                                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full font-mono">
                                    INBOX LIVE
                                </span>
                            </div>
                            <p class="text-xs text-white/60 mt-0.5">Kirim pesan langsung ke kotak masuk akun pengguna tertentu atau siarkan pengumuman ke seluruh pengguna.</p>
                        </div>
                    </div>
                </div>

                <!-- FORM KIRIM PESAN -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div id="admin-msg-status" class="hidden p-3 rounded-xl text-xs flex items-center gap-2"></div>

                    <!-- Target Recipient Switcher -->
                    <div>
                        <label class="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                            Pilih Target Penerima Pesan:
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            <button type="button" id="btn-msg-target-user" onclick="Profile.toggleAdminMsgRecipientMode('user')" class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                                <i data-lucide="user" class="w-4 h-4"></i>
                                <span>Pesan Pribadi (Direct ke Pengguna)</span>
                            </button>
                            <button type="button" id="btn-msg-target-all" onclick="Profile.toggleAdminMsgRecipientMode('all')" class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70">
                                <i data-lucide="users" class="w-4 h-4"></i>
                                <span>Pesan Siaran (Semua Pengguna)</span>
                            </button>
                        </div>
                    </div>

                    <!-- User Picker (Only visible when mode is 'user') -->
                    <div id="admin-msg-user-picker-container" class="space-y-2.5 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                        <label class="block text-xs font-bold text-white/80 uppercase tracking-wider">
                            Pilih Akun Pengguna Terdaftar (${users.length} Akun):
                        </label>
                        <select id="admin-msg-user-select" onchange="Profile.onAdminMsgUserSelectChange()" class="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer">
                            <option value="">-- Pilih akun dari daftar pengguna terdaftar --</option>
                            ${userOptionsHtml}
                        </select>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                                <label class="block text-[11px] text-white/50 mb-1">User ID Tujuan:</label>
                                <input type="text" id="admin-msg-user-id" placeholder="ID Pengguna" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition" />
                            </div>
                            <div>
                                <label class="block text-[11px] text-white/50 mb-1">Username Tujuan:</label>
                                <input type="text" id="admin-msg-user-name" placeholder="Username Pengguna" class="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 transition" />
                            </div>
                        </div>
                    </div>

                    <!-- Priority Selector & Title -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                                Prioritas Pesan:
                            </label>
                            <select id="admin-msg-priority" class="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer">
                                <option value="info">Info / Normal (Biru)</option>
                                <option value="important">Penting / Notifikasi (Kuning)</option>
                                <option value="warning">Peringatan / Sanksi (Merah)</option>
                                <option value="vip">VIP / Eksklusif (Ungu)</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                                Judul Pesan: <span class="text-rose-400">*</span>
                            </label>
                            <input type="text" id="admin-msg-title" placeholder="Contoh: Pemberitahuan Akun Anda / Bonus Spesial" class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 transition shadow-inner font-bold" />
                        </div>
                    </div>

                    <!-- Isi Pesan (Body) -->
                    <div>
                        <label class="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                            Isi Pesan: <span class="text-rose-400">*</span>
                        </label>
                        <textarea id="admin-msg-body" rows="3" placeholder="Tuliskan isi pesan pribadi atau instruksi untuk pengguna..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition shadow-inner leading-relaxed"></textarea>
                    </div>

                    <!-- Tautan Aksi (Opsional) -->
                    <div>
                        <label class="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                            Tautan Aksi / Link Tombol (Opsional):
                        </label>
                        <input type="text" id="admin-msg-action-url" placeholder="Contoh: /#profile atau https://..." class="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition shadow-inner" />
                    </div>

                    <!-- Submit Button -->
                    <div class="pt-2 border-t border-white/10 flex items-center justify-end">
                        <button type="button" id="admin-msg-send-btn" onclick="Profile.sendAdminMessage(event)" class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="send" class="w-4 h-4"></i>
                            <span>Kirim Pesan Sekarang</span>
                        </button>
                    </div>
                </div>

                <!-- RIWAYAT PESAN TERKIRIM -->
                <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="history" class="w-4 h-4 text-emerald-400"></i>
                            <span>Riwayat Pesan Terkirim (${sentMessages.length})</span>
                        </h4>
                        <button type="button" onclick="Profile.renderAdminMessagesTab(false)" class="text-[11px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer transition">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Segarkan
                        </button>
                    </div>

                    <div id="admin-sent-messages-list" class="space-y-2.5 max-h-[45vh] overflow-y-auto hide-scrollbar">
                        ${historyHtml}
                    </div>
                </div>
            </div>`;

            lucide.createIcons();
        } catch(e) {
            container.innerHTML = `
            <div class="text-center py-12 text-red-400 space-y-2">
                <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                <p class="text-xs font-semibold">Gagal memuat modul pesan admin.</p>
            </div>`;
            lucide.createIcons();
        }
    },

    toggleAdminMsgRecipientMode(mode) {
        Profile.adminMsgRecipientMode = mode;
        var btnUser = gid('btn-msg-target-user');
        var btnAll = gid('btn-msg-target-all');
        var pickerContainer = gid('admin-msg-user-picker-container');

        var activeClass = 'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20';
        var inactiveClass = 'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 text-white/70';

        if (btnUser) btnUser.className = mode === 'user' ? activeClass : inactiveClass;
        if (btnAll) btnAll.className = mode === 'all' ? activeClass : inactiveClass;
        if (pickerContainer) pickerContainer.classList.toggle('hidden', mode === 'all');
    },

    onAdminMsgUserSelectChange() {
        var select = gid('admin-msg-user-select');
        if (!select) return;
        var selectedOpt = select.options[select.selectedIndex];
        var idInp = gid('admin-msg-user-id');
        var nameInp = gid('admin-msg-user-name');

        if (selectedOpt && selectedOpt.value) {
            if (idInp) idInp.value = selectedOpt.value;
            if (nameInp) nameInp.value = selectedOpt.getAttribute('data-username') || '';
        }
    },

    async sendAdminMessage(event) {
        if (event && event.preventDefault) event.preventDefault();
        var token = Profile.getAdminToken();
        if (!token) return;

        var mode = Profile.adminMsgRecipientMode || 'user';
        var userId = (gid('admin-msg-user-id')?.value || '').trim();
        var username = (gid('admin-msg-user-name')?.value || '').trim();
        var priority = gid('admin-msg-priority')?.value || 'info';
        var title = (gid('admin-msg-title')?.value || '').trim();
        var body = (gid('admin-msg-body')?.value || '').trim();
        var actionUrl = (gid('admin-msg-action-url')?.value || '').trim();
        var statusBox = gid('admin-msg-status');
        var sendBtn = gid('admin-msg-send-btn');

        if (!title || !body) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>Judul dan isi pesan wajib diisi.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
            return;
        }

        if (mode === 'user' && !userId && !username) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>Silakan pilih akun pengguna tujuan terlebih dahulu.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
            return;
        }

        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.classList.add('opacity-70');
            sendBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Mengirim Pesan...</span>';
            lucide.createIcons();
        }

        try {
            var res = await fetch('/api/messages?action=admin_send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({
                    recipientType: mode,
                    recipientId: userId || username,
                    recipientName: username || userId,
                    priority: priority,
                    title: title,
                    body: body,
                    actionUrl: actionUrl
                })
            });
            var data = await res.json();

            if (data.status) {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Pesan berhasil dikirim!');
                }

                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
                    statusBox.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i><span>' + data.message + '</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }

                // Reset fields
                if (gid('admin-msg-title')) gid('admin-msg-title').value = '';
                if (gid('admin-msg-body')) gid('admin-msg-body').value = '';
                if (gid('admin-msg-action-url')) gid('admin-msg-action-url').value = '';

                Profile.renderAdminMessagesTab(true);
            } else {
                if (statusBox) {
                    statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                    statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>' + (data.message || 'Gagal mengirim pesan') + '</span>';
                    statusBox.classList.remove('hidden');
                    lucide.createIcons();
                }
            }
        } catch(e) {
            if (statusBox) {
                statusBox.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300';
                statusBox.innerHTML = '<i data-lucide="wifi-off" class="w-4 h-4 shrink-0"></i><span>Koneksi bermasalah saat mengirim pesan.</span>';
                statusBox.classList.remove('hidden');
                lucide.createIcons();
            }
        } finally {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.classList.remove('opacity-70');
                sendBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span>Kirim Pesan Sekarang</span>';
                lucide.createIcons();
            }
        }
    },

    async deleteAdminMessage(id) {
        var token = Profile.getAdminToken();
        if (!token) {
            if (typeof showToast === 'function') showToast('Sesi admin tidak ditemukan. Silakan login kembali.');
            return;
        }
        if (!id) return;

        Profile.showConfirmModal({
            title: 'Hapus Pesan Admin',
            message: 'Apakah Anda yakin ingin menghapus pesan ini secara permanen dari riwayat pesan admin?',
            confirmText: 'Ya, Hapus Pesan',
            confirmClass: 'bg-red-600 hover:bg-red-700 shadow-red-500/40',
            onConfirm: async function() {
                try {
                    var res = await fetch('/api/messages?action=admin_delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-admin-token': token
                        },
                        body: JSON.stringify({ id: id })
                    });
                    var data = await res.json();
                    if (data && data.status) {
                        if (typeof showToast === 'function') showToast('Pesan berhasil dihapus');
                        Profile.renderAdminMessagesTab(true);
                    } else {
                        if (typeof showToast === 'function') showToast(data?.message || 'Gagal menghapus pesan');
                    }
                } catch(e) {
                    if (typeof showToast === 'function') showToast('Terjadi kesalahan jaringan saat menghapus pesan');
                }
            }
        });
    },

    // ==========================================
    // 11. USER INBOX & NOTIFICATIONS
    // ==========================================
    lastSeenUserUnreadCount: 0,

    async checkUserInboxBadge() {
        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var userId = u ? (u.id || u.uid) : 'guest';
        var username = u ? (u.username || '') : '';
        var token = localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');

        var headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;
        headers['x-user-id'] = userId;
        headers['x-user-name'] = username;

        try {
            var res = await fetch(`/api/messages?action=user_inbox&userId=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}`, { headers: headers });
            var data = await res.json();

            if (data && data.status) {
                var badgeEl = gid('user-inbox-badge');
                var count = data.unreadCount || 0;
                if (badgeEl) {
                    if (count > 0) {
                        badgeEl.innerText = count > 99 ? '99+' : count;
                        badgeEl.classList.remove('hidden');
                    } else {
                        badgeEl.classList.add('hidden');
                    }
                }

                // If new unread message arrived
                if (count > Profile.lastSeenUserUnreadCount && Profile.lastSeenUserUnreadCount > 0) {
                    if (data.messages && data.messages.length > 0) {
                        var latest = data.messages[0];
                        if (!latest.isRead && typeof showToast === 'function') {
                            showToast('🔔 Pesan dari Admin: ' + latest.title);
                        }
                    }
                }
                Profile.lastSeenUserUnreadCount = count;
            }
        } catch(e) {}
    },

    async openUserInboxModal() {
        var existing = gid('musifystar-user-inbox-modal');
        if (existing) existing.remove();

        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var userId = u ? (u.id || u.uid) : 'guest';
        var username = u ? (u.username || '') : '';
        var token = localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');

        var headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;
        headers['x-user-id'] = userId;
        headers['x-user-name'] = username;

        var modal = document.createElement('div');
        modal.id = 'musifystar-user-inbox-modal';
        modal.className = 'fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in';
        modal.innerHTML = `
        <div class="w-full max-w-md bg-[#11131a] border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[88vh]" style="box-shadow: 0 25px 50px -12px rgba(6,182,212,0.25);">
            <!-- Close Button -->
            <button onclick="Profile.closeUserInboxModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer z-10">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>

            <!-- Header -->
            <div class="p-5 pb-3 border-b border-white/10 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
                        <i data-lucide="mail" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h2 class="text-base sm:text-lg font-black text-white tracking-tight">Kotak Masuk Pesan Admin</h2>
                        <p class="text-xs text-white/60">Pemberitahuan resmi dan pesan pribadi dari administrator MusifyStar.</p>
                    </div>
                </div>
            </div>

            <!-- Action bar -->
            <div class="px-5 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs shrink-0">
                <span id="user-inbox-count-label" class="text-white/50 text-[11px]">Memuat pesan...</span>
                <button type="button" onclick="Profile.markAllUserMessagesRead()" class="text-cyan-400 hover:text-cyan-300 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition cursor-pointer">
                    <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
                    <span>Tandai Semua Dibaca</span>
                </button>
            </div>

            <!-- Messages List Container -->
            <div id="user-inbox-messages-container" class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 hide-scrollbar">
                <div class="text-center py-12 text-white/50 space-y-2">
                    <i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-cyan-400"></i>
                    <p class="text-xs">Mengambil pesan masuk...</p>
                </div>
            </div>
        </div>`;

        modal.onclick = function(e) {
            if (e.target === modal) Profile.closeUserInboxModal();
        };

        document.body.appendChild(modal);
        lucide.createIcons();

        // Fetch messages
        try {
            var res = await fetch(`/api/messages?action=user_inbox&userId=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}`, { headers: headers });
            var data = await res.json();
            var container = gid('user-inbox-messages-container');
            var countLabel = gid('user-inbox-count-label');

            if (data && data.status && Array.isArray(data.messages) && data.messages.length > 0) {
                if (countLabel) countLabel.innerText = data.messages.length + ' pesan (' + data.unreadCount + ' belum dibaca)';

                container.innerHTML = data.messages.map(function(m) {
                    var dateStr = new Date(m.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                    var priorityClass = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
                    var priorityText = 'INFO';
                    if (m.priority === 'warning') { priorityClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30'; priorityText = 'PERINGATAN'; }
                    else if (m.priority === 'important') { priorityClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30'; priorityText = 'PENTING'; }
                    else if (m.priority === 'vip') { priorityClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30'; priorityText = 'VIP'; }

                    var unreadDot = !m.isRead ? '<span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-md shadow-cyan-400/50"></span>' : '';

                    return `
                    <div onclick="Profile.markUserMessageRead('${m.id}')" class="p-4 rounded-2xl ${m.isRead ? 'bg-white/[0.03] border-white/10' : 'bg-cyan-500/[0.07] border-cyan-500/30 shadow-md shadow-cyan-500/10'} border transition-all space-y-2 cursor-pointer group hover:border-cyan-400/50">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                ${unreadDot}
                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityClass} font-mono">Pesan Dari : Admin MusifyStar</span>
                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityClass} font-mono">${priorityText}</span>
                                <span class="text-[11px] text-white/50 font-medium"></span>
                            </div>
                            <span class="text-[10px] text-white/40">${dateStr}</span>
                        </div>
                        <h4 class="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">${Profile.escapeHtml(m.title)}</h4>
                        <p class="text-xs text-white/80 whitespace-pre-wrap leading-relaxed">${Profile.escapeHtml(m.body)}</p>
                        ${m.actionUrl ? `
                        <div class="pt-2">
                            <a href="${Profile.escapeHtml(m.actionUrl)}" target="_blank" onclick="event.stopPropagation()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] transition active:scale-95">
                                <span>Buka Tautan</span>
                                <i data-lucide="external-link" class="w-3 h-3"></i>
                            </a>
                        </div>` : ''}
                    </div>`;
                }).join('');
                lucide.createIcons();
            } else {
                if (countLabel) countLabel.innerText = '0 pesan';
                container.innerHTML = `
                <div class="text-center py-16 text-white/50 space-y-3">
                    <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                        <i data-lucide="inbox" class="w-7 h-7"></i>
                    </div>
                    <h4 class="text-sm font-bold text-white">Kotak Masuk Kosong</h4>
                    <p class="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                        Anda belum memiliki pesan pribadi atau pengumuman dari administrator MusifyStar.
                    </p>
                </div>`;
                lucide.createIcons();
            }
        } catch(e) {
            var container = gid('user-inbox-messages-container');
            if (container) {
                container.innerHTML = `
                <div class="text-center py-12 text-red-400 space-y-2">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                    <p class="text-xs font-semibold">Gagal memuat kotak masuk pesan.</p>
                </div>`;
                lucide.createIcons();
            }
        }
    },

    closeUserInboxModal() {
        var modal = gid('musifystar-user-inbox-modal');
        if (modal) modal.remove();
        Profile.checkUserInboxBadge();
    },

    async markUserMessageRead(msgId) {
        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var userId = u ? (u.id || u.uid) : 'guest';
        var username = u ? (u.username || '') : '';
        var token = localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');

        var headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        headers['x-user-id'] = userId;
        headers['x-user-name'] = username;

        try {
            await fetch('/api/messages?action=user_mark_read', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ messageId: msgId })
            });
            Profile.checkUserInboxBadge();
        } catch(e) {}
    },

    async markAllUserMessagesRead() {
        var u = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
        var userId = u ? (u.id || u.uid) : 'guest';
        var username = u ? (u.username || '') : '';
        var token = localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');

        var headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        headers['x-user-id'] = userId;
        headers['x-user-name'] = username;

        try {
            await fetch('/api/messages?action=user_mark_all_read', {
                method: 'POST',
                headers: headers
            });
            if (typeof showToast === 'function') {
                showToast('Semua pesan ditandai telah dibaca');
            }
            Profile.openUserInboxModal();
            Profile.checkUserInboxBadge();
        } catch(e) {}
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

var Dev = Profile;
window.Profile = Profile;
window.Dev = Profile;
