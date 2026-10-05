var Auth = {
    currentUser: null,
    token: null,
    mode: 'login', // 'login' | 'register'
    isPasswordVisible: false,

    init() {
        var savedToken = localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');
        var savedUser = localStorage.getItem('musifystar_auth_user') || sessionStorage.getItem('musifystar_auth_user');

        // Check persistent local ban first
        try {
            var savedBanRaw = localStorage.getItem('musifystar_active_ban');
            if (savedBanRaw) {
                var savedBan = JSON.parse(savedBanRaw);
                if (savedBan && savedBan.ban) {
                    var isExpired = false;
                    if (savedBan.ban.banType === 'temporary' && savedBan.ban.banExpiresAt) {
                        if (new Date(savedBan.ban.banExpiresAt).getTime() <= Date.now()) {
                            isExpired = true;
                        }
                    }
                    if (!isExpired) {
                        Auth.activeBannedUser = savedBan.user || null;
                        setTimeout(function() {
                            Auth.showBanModal(savedBan.ban);
                        }, 80);
                    } else {
                        localStorage.removeItem('musifystar_active_ban');
                    }
                }
            }
        } catch(e) {}

        if (savedToken) {
            Auth.token = savedToken;
            if (savedUser) {
                try { Auth.currentUser = JSON.parse(savedUser); } catch(e) {}
            }
        }
        Auth.checkSession();
        Auth.startRealtimeBanMonitor();

        // Check ban immediately when switching back to browser tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                Auth.checkSession();
            }
        });
    },

    startRealtimeBanMonitor() {
        if (window._realtimeBanMonitorTimer) clearInterval(window._realtimeBanMonitorTimer);
        // Poll every 30 seconds for background safety & ban sync
        window._realtimeBanMonitorTimer = setInterval(function() {
            Auth.checkSession();
        }, 30000);
    },

    async checkSession() {
        try {
            var headers = {};
            var url = '/api/user-auth?action=me';
            if (Auth.token) {
                headers['Authorization'] = 'Bearer ' + Auth.token;
                headers['X-Auth-Token'] = Auth.token;
                url += '&token=' + encodeURIComponent(Auth.token);
            }
            if (Auth.currentUser) {
                if (Auth.currentUser.id) headers['X-User-Id'] = Auth.currentUser.id;
                if (Auth.currentUser.username) headers['X-User-Name'] = Auth.currentUser.username;
                var em = Auth.currentUser.rawEmail || Auth.currentUser.email;
                if (em) headers['X-User-Email'] = em;
                url += '&userId=' + encodeURIComponent(Auth.currentUser.id || '') +
                       '&username=' + encodeURIComponent(Auth.currentUser.username || '') +
                       '&email=' + encodeURIComponent(em || '');
            } else if (Auth.activeBannedUser) {
                if (Auth.activeBannedUser.userId) headers['X-User-Id'] = Auth.activeBannedUser.userId;
                if (Auth.activeBannedUser.username) headers['X-User-Name'] = Auth.activeBannedUser.username;
                var em = Auth.activeBannedUser.rawEmail || Auth.activeBannedUser.email;
                if (em) headers['X-User-Email'] = em;
                url += '&userId=' + encodeURIComponent(Auth.activeBannedUser.userId || '') +
                       '&username=' + encodeURIComponent(Auth.activeBannedUser.username || '') +
                       '&email=' + encodeURIComponent(em || '');
            }

            var res = await fetch(url, {
                headers: headers,
                cache: 'no-store'
            });
            var data = await res.json();

            // First check if IP or Account is Banned or Warned
            if (data && (data.ipBanned || data.banned || (data.ban && (data.ban.isBanned || data.ban.isIpBanned || data.ban.isWarning)))) {
                // Pause audio playback if playing
                if (window.MusicPlayer) {
                    try {
                        if (typeof MusicPlayer.pause === 'function') MusicPlayer.pause();
                        if (MusicPlayer.sound && typeof MusicPlayer.sound.pause === 'function') MusicPlayer.sound.pause();
                    } catch(e){}
                }
                gid('header-auth-dropdown-wrapper')?.remove();
                gid('user-profile-modal')?.remove();
                gid('auth-modal-overlay')?.remove();
                if (data.user) {
                    Auth.activeBannedUser = {
                        username: data.user.username,
                        userId: data.user.id,
                        email: data.user.rawEmail || data.user.email
                    };
                } else if (Auth.currentUser) {
                    Auth.activeBannedUser = {
                        username: Auth.currentUser.username,
                        userId: Auth.currentUser.id,
                        email: Auth.currentUser.rawEmail || Auth.currentUser.email
                    };
                }
                try {
                    localStorage.setItem('musifystar_active_ban', JSON.stringify({
                        ban: data.ban,
                        user: Auth.activeBannedUser
                    }));
                } catch(e){}
                Auth.currentUser = null;
                localStorage.removeItem('musifystar_auth_user');
                sessionStorage.removeItem('musifystar_auth_user');
                Auth.updateHeaderUI();
                Auth.showBanModal(data.ban || { isBanned: true, isIpBanned: !!data.ipBanned, banReason: data.message });
                return;
            }

            // Remove existing ban modal ONLY when confirmed safe
            var existingModal = gid('user-banned-banner-modal');
            if (existingModal) {
                var modalCategory = existingModal.dataset.banCategory;
                // If modal was for IP ban, remove only if server confirms IP is not banned
                if (modalCategory === 'ip' && data && !data.ipBanned && (!data.ban || !data.ban.isIpBanned)) {
                    existingModal.remove();
                }
                // If modal was for Account ban, remove if server confirms account is not banned
                else if (modalCategory === 'account' && data && !data.banned && (!data.ban || !data.ban.isBanned)) {
                    existingModal.remove();
                    try { localStorage.removeItem('musifystar_active_ban'); } catch(e) {}
                }
            }

            if (data && data.authenticated && data.user) {
                Auth._failedSessionChecks = 0;
                Auth.currentUser = data.user;
                if (data.newToken) {
                    Auth.token = data.newToken;
                    if (localStorage.getItem('musifystar_auth_token')) {
                        localStorage.setItem('musifystar_auth_token', data.newToken);
                    } else {
                        sessionStorage.setItem('musifystar_auth_token', data.newToken);
                    }
                }
                if (localStorage.getItem('musifystar_auth_token')) {
                    localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                }
                Auth.updateHeaderUI();
            } else if (res.status === 401 || (data && data.tokenInvalid === true)) {
                // Only clear session if server explicitly returned 401 or tokenInvalid on consecutive checks
                Auth._failedSessionChecks = (Auth._failedSessionChecks || 0) + 1;
                if (Auth._failedSessionChecks >= 3) {
                    Auth.token = null;
                    Auth.currentUser = null;
                    localStorage.removeItem('musifystar_auth_token');
                    localStorage.removeItem('musifystar_auth_user');
                    sessionStorage.removeItem('musifystar_auth_token');
                    sessionStorage.removeItem('musifystar_auth_user');
                    Auth.updateHeaderUI();
                }
            }
        } catch (e) {
            console.warn('Check session error:', e);
        }
    },

    updateHeaderUI() {
        var profileBtns = document.querySelectorAll('.header-profile-btn');
        profileBtns.forEach(function(btn) {
            if (Auth.currentUser) {
                btn.innerHTML = '<img src="' + (Auth.currentUser.avatar || '/logo.png') + '" class="w-full h-full rounded-full object-cover" alt="Avatar" onerror="this.src=\'/logo.png\'">';
                btn.setAttribute('title', 'Akun: ' + Auth.currentUser.username);
            } else {
                btn.innerHTML = '<i data-lucide="user" class="w-5 h-5"></i>';
                btn.setAttribute('title', 'Login / Profil');
            }
        });

        // Toggle Global Chat Button (Only available when logged in)
        var chatBtn = gid('header-global-chat-btn');
        if (chatBtn) {
            if (Auth.currentUser) {
                chatBtn.classList.remove('hidden');
            } else {
                chatBtn.classList.add('hidden');
            }
        }

        // Ensure bottom navigation dev tab retains code icon
        var navDev = gid('nav-dev');
        if (navDev) {
            var iconWrap = navDev.querySelector('.magic-tab-icon');
            if (iconWrap) {
                iconWrap.innerHTML = '<i data-lucide="code"></i>';
            }
        }

        // Re-render Profile page if it is currently displayed
        if (typeof Profile !== 'undefined' && typeof Profile.render === 'function' && typeof S !== 'undefined' && S.at === 'dev') {
            Profile.render();
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }
    },

    toggleTopDropdown(triggerEl) {
        var existing = gid('header-auth-dropdown-wrapper');
        if (existing) {
            existing.remove();
            return;
        }

        var wrapper = document.createElement('div');
        wrapper.id = 'header-auth-dropdown-wrapper';

        // When user is not logged in: present the exact Hover Expanding Neon Conic Gradient Modal from the video
        if (!Auth.currentUser) {
            wrapper.className = 'fixed inset-0 z-[700] flex items-center justify-center p-4 animate-fadeIn pointer-events-auto';
            wrapper.innerHTML = `
                <!-- Backdrop click to dismiss -->
                <div onclick="gid('header-auth-dropdown-wrapper')?.remove()" class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>

                <!-- Floating Close Button at top right of screen -->
                <button onclick="gid('header-auth-dropdown-wrapper')?.remove()" class="fixed top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition active:scale-95 cursor-pointer z-40" title="Tutup">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>

                <!-- Centered Hover Expanding Card -->
                <div class="relative z-10 flex flex-col items-center">
                    <div id="neon-login-box" class="neon-box-card ${Auth.mode === 'register' ? 'mode-register' : ''}" onclick="Auth.toggleCardExpand(event)">
                        <!-- Inner dark box -->
                        <div class="neon-box-card-inner">
                            <div id="header-auth-content" class="w-full h-full flex flex-col">
                                ${Auth.getFormHTML('header-')}
                            </div>
                        </div>
                    </div>

                    <!-- Hint below card -->
                    <p class="text-white/40 text-[11px] mt-4 font-medium select-none pointer-events-none transition-opacity duration-300">
                        KLIK BAGIAN LOGIN UNTUK BUAT AKUN
                    </p>
                </div>
            `;
        } else {
            // When user is already logged in: present the top-right anchored profile dropdown
            wrapper.className = 'fixed inset-0 z-50 flex justify-end items-start pt-16 pr-4 sm:pr-8 animate-fadeIn pointer-events-auto';
            wrapper.innerHTML = `
                <!-- Backdrop click to dismiss -->
                <div onclick="gid('header-auth-dropdown-wrapper')?.remove()" class="fixed inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                <!-- Floating Card Anchored Under Profile Button -->
                <div class="relative z-10 w-[92vw] max-w-[340px] bg-[#12141c]/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl shadow-black/80 text-left transition-all duration-300 transform scale-100 origin-top-right">
                    <!-- Close Button -->
                    <button onclick="gid('header-auth-dropdown-wrapper')?.remove()" class="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition active:scale-95 cursor-pointer">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>

                    <div id="header-auth-content">
                        ${Auth.getLoggedInDropdownHTML()}
                    </div>
                </div>
            `;
        }

        document.body.appendChild(wrapper);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }
    },

    toggleCardExpand(e) {
        if (e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('input') || e.target.closest('form'))) {
            return;
        }
        var box = gid('neon-login-box');
        if (box) {
            box.classList.toggle('expanded');
        }
    },

    openLoginModal(mode) {
        if (mode) Auth.mode = mode;
        if (Auth.currentUser) {
            Auth.openUserProfileModal();
            return;
        }
        var existing = gid('header-auth-dropdown-wrapper');
        if (existing) existing.remove();
        Auth.toggleTopDropdown();
    },

    setMode(mode, prefix) {
        Auth.mode = mode;
        Auth.isPasswordVisible = false;
        var p = prefix || 'header-';
        var box = gid('neon-login-box');
        if (box) {
            if (mode === 'register') {
                box.classList.add('mode-register');
            } else {
                box.classList.remove('mode-register');
            }
            box.classList.add('expanded');
        }
        var container = gid('header-auth-content');
        if (container) {
            container.innerHTML = Auth.getFormHTML(p);
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                try { window.lucide.createIcons(); } catch(e){}
            }
        }
    },

    togglePassword(inputFieldId, iconId) {
        var input = gid(inputFieldId);
        var icon = gid(iconId);
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = 'password';
            if (icon) icon.setAttribute('data-lucide', 'eye');
        }
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }
    },

    getFormHTML(prefix) {
        prefix = prefix || 'header-';
        if (Auth.mode === 'login') {
            return `
            <!-- Header (Visible in compact pill, centered) -->
            <div class="neon-header-row select-none justify-center gap-2" title="Klik untuk buka / tutup">
                <span class="font-black text-sm tracking-widest text-white uppercase">LOGIN</span>
                <span class="text-[#35eaff] flex items-center shrink-0">
                    <i data-lucide="lock" class="w-4 h-4"></i>
                </span>
            </div>

            <!-- Expanding Content (fades in on hover / open) -->
            <div class="neon-body-content">
                <form onsubmit="Auth.handleLogin(event, '${prefix}')" class="w-full space-y-3 pt-1">
                    <!-- Username field -->
                    <div>
                        <input type="text" id="${prefix}auth-login-username" required placeholder="Username" autocomplete="username" class="neon-v-input">
                    </div>

                    <!-- Password field with eye toggle -->
                    <div class="relative flex items-center">
                        <input type="password" id="${prefix}auth-login-password" minlength="6" required placeholder="Password" autocomplete="current-password" class="neon-v-input pr-10">
                        <button type="button" onclick="Auth.togglePassword('${prefix}auth-login-password', '${prefix}auth-login-eye-icon')" class="absolute right-3.5 text-white/40 hover:text-[#35eaff] active:scale-95 transition cursor-pointer" title="Lihat/Sembunyikan Password">
                            <i id="${prefix}auth-login-eye-icon" data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Sign in Button (Vivid Cyan pill button from video) -->
                    <div class="pt-1">
                        <button type="submit" id="${prefix}auth-login-btn" class="neon-v-btn">
                            <span>LOGIN AKUN</span>
                        </button>
                    </div>

                    <!-- Footer Links: Forgot Password & Sign up -->
                    <div class="flex items-center justify-between text-xs px-1 pt-1 select-none">
                        <span class="text-white/60 hover:text-white hover:underline cursor-pointer transition">belum ada aku?</span>
                        <button type="button" onclick="Auth.setMode('register', '${prefix}')" class="text-[#ff10de] hover:text-[#ff3aeb] font-bold cursor-pointer transition">
                            daftar disini
                        </button>
                    </div>
                </form>
            </div>
            `;
        } else {
            return `
            <!-- Header (Visible in compact pill, centered) -->
            <div class="neon-header-row select-none" title="Klik untuk buka / tutup">
                <span class="text-[#35eaff] flex items-center shrink-0">
                    <i data-lucide="user-plus" class="w-4 h-4"></i>
                </span>
                <span class="font-black text-sm tracking-widest text-white uppercase">REGISTER</span>
                <span class="text-[#ff10de] flex items-center shrink-0">
                    <i data-lucide="lock" class="w-4 h-4"></i>
                </span>
            </div>

            <!-- Expanding Content (fades in on hover / open) -->
            <div class="neon-body-content">
                <form onsubmit="Auth.handleRegister(event, '${prefix}')" class="w-full space-y-3 pt-1">
                    <!-- Username field -->
                    <div>
                        <input type="text" id="${prefix}auth-reg-username" required placeholder="Username" autocomplete="username" class="neon-v-input">
                    </div>

                    <!-- Email field -->
                    <div>
                        <input type="email" id="${prefix}auth-reg-email" required placeholder="Email Address" autocomplete="email" class="neon-v-input">
                    </div>

                    <!-- Password field with eye toggle -->
                    <div class="relative flex items-center">
                        <input type="password" id="${prefix}auth-reg-password" minlength="6" required placeholder="Password" autocomplete="new-password" class="neon-v-input pr-10">
                        <button type="button" onclick="Auth.togglePassword('${prefix}auth-reg-password', '${prefix}auth-reg-eye-icon')" class="absolute right-3.5 text-white/40 hover:text-[#ff10de] active:scale-95 transition cursor-pointer" title="Lihat/Sembunyikan Password">
                            <i id="${prefix}auth-reg-eye-icon" data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Sign up Button (Vivid Magenta pill button) -->
                    <div class="pt-1">
                        <button type="submit" id="${prefix}auth-reg-btn" class="neon-v-btn neon-v-btn-reg">
                            <span>DAFTARKAN AKUN</span>
                        </button>
                    </div>

                    <!-- Footer Links: Back to Sign in -->
                    <div class="flex items-center justify-between text-xs px-1 pt-1 select-none">
                        <span class="text-white/60">Sudah punya akun?</span>
                        <button type="button" onclick="Auth.setMode('login', '${prefix}')" class="text-[#35eaff] hover:text-[#56efff] font-bold cursor-pointer transition">
                            login disini
                        </button>
                    </div>
                </form>
            </div>
            `;
        }
    },

    getBadgeSettings() {
        var saved = localStorage.getItem('musify_badge_settings');
        if (saved) {
            try {
                var parsed = JSON.parse(saved);
                if (parsed && typeof parsed.offsetY === 'number') {
                    if (!localStorage.getItem('musify_badge_offset_fixed_v4')) {
                        parsed.offsetY = -3;
                        localStorage.setItem('musify_badge_offset_fixed_v4', 'true');
                        localStorage.setItem('musify_badge_settings', JSON.stringify(parsed));
                    }
                }
                return parsed;
            } catch(e){}
        }
        return { margin: 2, size: 15, offsetY: -3, color: '#0095F6' };
    },

    saveBadgeSettings(s) {
        localStorage.setItem('musify_badge_settings', JSON.stringify(s));
    },

    getVerifiedBadgeHTML(customSettings) {
        var s = customSettings || Auth.getBadgeSettings();
        var margin = typeof s.margin === 'number' ? s.margin : 2;
        var size = typeof s.size === 'number' ? s.size : 15;
        var offsetY = typeof s.offsetY === 'number' ? s.offsetY : -3;
        var color = s.color || '#0095F6';
        var checkColor = (color.toLowerCase() === '#ffffff') ? '#000000' : '#FFFFFF';

        return `
        <span class="inline-flex items-center shrink-0 self-center" style="margin-left: ${margin}px; transform: translateY(${offsetY}px);" title="Akun Terverifikasi">
            <svg style="width: ${size}px; height: ${size}px;" class="shrink-0 inline-block align-middle" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="${color}" ${color.toLowerCase() === '#ffffff' ? 'stroke="#d4d4d8" stroke-width="1"' : ''}/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L10 13.586l5.293-5.293a1 1 0 0 1 1.414 0z" fill="${checkColor}"/>
            </svg>
        </span>`;
    },

    toggleBadgeSettingsPanel() {
        var content = gid('badge-settings-content');
        var chevron = gid('badge-panel-chevron');
        if (!content) return;
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    },

    toggleIslamicCountdownPanel() {
        var content = gid('islamic-countdown-content');
        var chevron = gid('islamic-panel-chevron');
        if (!content) return;
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
            if (typeof IslamicClock !== 'undefined') {
                IslamicClock.updateCountdownDOMForProfileCard();
            }
        } else {
            content.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    },

    copyText(text, msg) {
        if (!text) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                var ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            if (typeof showToast === 'function') {
                showToast(msg || 'Berhasil disalin!');
            }
        } catch(e) {
            if (typeof showToast === 'function') {
                showToast(msg || 'Berhasil disalin!');
            }
        }
    },

    updateBadgeControl(field, value) {
        var s = Auth.getBadgeSettings();
        if (field === 'margin' || field === 'size' || field === 'offsetY') {
            s[field] = parseInt(value, 10);
        } else if (field === 'color') {
            s[field] = value;
        }
        Auth.saveBadgeSettings(s);

        var modalBadgeWrapper = gid('modal-badge-wrapper');
        if (modalBadgeWrapper) {
            modalBadgeWrapper.innerHTML = Auth.getVerifiedBadgeHTML(s);
        }
        var dropdownBadgeWrapper = gid('dropdown-badge-wrapper');
        if (dropdownBadgeWrapper) {
            dropdownBadgeWrapper.innerHTML = Auth.getVerifiedBadgeHTML(s);
        }
        document.querySelectorAll('.global-verified-badge-container').forEach(function(el) {
            el.innerHTML = Auth.getVerifiedBadgeHTML(s);
        });

        var lblMargin = gid('lbl-badge-margin');
        if (lblMargin) lblMargin.innerText = s.margin + 'px';
        var lblSize = gid('lbl-badge-size');
        if (lblSize) lblSize.innerText = s.size + 'px';
        var lblOffsetY = gid('lbl-badge-offsetY');
        if (lblOffsetY) lblOffsetY.innerText = (s.offsetY > 0 ? '+' : '') + s.offsetY + 'px';
    },

    resetBadgeSettings() {
        var defaultSettings = { margin: 2, size: 15, offsetY: -3, color: '#0095F6' };
        Auth.saveBadgeSettings(defaultSettings);

        var inpMargin = gid('inp-badge-margin');
        if (inpMargin) inpMargin.value = 2;
        var inpSize = gid('inp-badge-size');
        if (inpSize) inpSize.value = 15;
        var inpOffsetY = gid('inp-badge-offsetY');
        if (inpOffsetY) inpOffsetY.value = -3;

        Auth.updateBadgeControl('color', '#0095F6');
    },

    getLoggedInDropdownHTML() {
        var u = Auth.currentUser;
        if (!u) return '';
        var joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Baru saja';
        var isMasterAdmin = ((u.email || u.rawEmail || '').toLowerCase().trim() === 'jrnabil570@gmail.com');
        return `
        <div>
            <div class="flex items-center gap-3 pb-3 border-b border-white/10 pr-6">
                <div class="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <img src="${u.avatar || '/logo.png'}" class="w-full h-full object-cover rounded-full" alt="Avatar" onerror="this.src='/logo.png'" />
                </div>
                <div>
                    <div class="flex items-center">
                        <h3 class="text-white font-bold text-sm leading-tight">${es(u.username)}</h3>${isMasterAdmin ? `
                        <span id="dropdown-badge-wrapper" class="global-verified-badge-container">${Auth.getVerifiedBadgeHTML()}</span>` : ''}
                    </div>
                    <p class="text-white/60 text-[11px] truncate max-w-[170px]">${es(u.email)}</p>
                </div>
            </div>

            <div class="py-2.5 space-y-1 text-[11px]">
                <div class="flex justify-between items-center text-white/70">
                    <span>Status</span>
                    <span class="text-emerald-400 font-semibold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ${isMasterAdmin ? 'Administrator' : 'Member Aktif'}
                    </span>
                </div>
                <div class="flex justify-between items-center text-white/70">
                    <span>Bergabung</span>
                    <span class="text-white/90">${joinDate}</span>
                </div>
            </div>

            <div class="pt-2.5 border-t border-white/10 space-y-2">
                <button onclick="gid('header-auth-dropdown-wrapper')?.remove(); Auth.openUserProfileModal();" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-500/30 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm">
                    <i data-lucide="user-pen" class="w-3.5 h-3.5 text-sky-400"></i>
                    <span>Buka Halaman Profil</span>
                </button>
                ${isMasterAdmin ? `
                <button onclick="gid('header-auth-dropdown-wrapper')?.remove(); if(typeof Profile !== 'undefined') Profile.openAdminModal();" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 via-rose-600/30 to-purple-600/30 hover:from-purple-600/40 hover:to-rose-600/40 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-purple-400"></i>
                    <span>Panel Admin (Master)</span>
                </button>` : ''}
                <button onclick="Auth.logout()" class="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                    <span>Keluar Akun</span>
                </button>
            </div>
        </div>
        `;
    },

    openUserProfileModal() {
        var u = Auth.currentUser;
        if (!u) {
            Auth.toggleTopDropdown();
            return;
        }

        var existing = gid('user-profile-modal');
        if (existing) existing.remove();

        var avatarUrl = u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username)}`;
        var joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '23 Sep 2026';
        var isVerified = ((u.email || '').toLowerCase().trim() === 'jrnabil570@gmail.com');
        var badgeS = Auth.getBadgeSettings();
        var userIdVal = u.id || u.userId || u._id || 'usr_' + Date.now();
        var userIp = u.ip || u.lastIp || Auth.clientIp || '114.122.45.10';

        var modal = document.createElement('div');
        modal.id = 'user-profile-modal';
        modal.className = 'fixed inset-0 z-[650] bg-[#07090e] flex flex-col select-none overflow-hidden';
        modal.style.animation = 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        modal.innerHTML = `
            <!-- Hidden Gallery File Picker (NO capture attribute: strictly phone/PC gallery only) -->
            <input type="file" id="auth-gallery-file-input" accept="image/png, image/jpeg, image/webp, image/gif" style="display:none;" onchange="Auth.uploadAvatarFromGallery(event)">

            <!-- Full Page Sticky Header -->
            <div class="pt-8 pb-3.5 px-4 sticky top-0 z-30 border-b border-white/10 shadow-2xl transition-all flex items-center justify-between" style="background: linear-gradient(180deg, rgba(13, 15, 22, 0.88) 0%, rgba(13, 15, 22, 0.97) 100%), url('/banner.png') center/cover no-repeat; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                <div class="flex items-center gap-3">
                    <button onclick="gid('user-profile-modal')?.remove()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-sm" title="Kembali">
                        <i data-lucide="arrow-left" class="w-5 h-5"></i>
                    </button>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md leading-tight">Halaman Profil</h1>
                        <p class="text-white/50 text-[11px] leading-tight mt-0.5">Kelola akun & data profil Anda</p>
                    </div>
                </div>
                <button onclick="gid('user-profile-modal')?.remove(); Auth.logout();" class="text-xs px-3.5 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm" title="Keluar Akun">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                    <span>Keluar</span>
                </button>
            </div>

            <!-- Full Page Scrollable Body -->
            <div class="flex-1 overflow-y-auto hide-scrollbar p-4 max-w-md mx-auto w-full pb-32 space-y-3.5">
                
                <!-- 1. Header Profil & Foto Profil (Galeri) -->
                <div class="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm transition-all">
                    <div class="relative cursor-pointer shrink-0" onclick="Auth.triggerGalleryUpload()" title="Klik untuk ubah foto profil dari galeri">
                        <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-white/25 shadow-md bg-black/40">
                            <img id="modal-user-avatar-img" src="${avatarUrl}" class="w-full h-full object-cover rounded-full" alt="Foto Profil" onerror="this.src='/logo.png'">
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-white font-black text-base truncate mb-0.5 flex items-center">
                            <span>${es(u.username)}</span>${isVerified ? `
                            <span id="modal-badge-wrapper" class="global-verified-badge-container">${Auth.getVerifiedBadgeHTML(badgeS)}</span>` : ''}
                        </p>
                        <p class="text-white/60 text-xs truncate mb-2.5">${es(u.email)}</p>
                        <button onclick="Auth.triggerGalleryUpload()" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 rounded-full cursor-pointer active:scale-95 transition-all shadow-sm">
                            <i data-lucide="image" class="w-3.5 h-3.5"></i>
                            <span>Pilih dari Galeri</span>
                        </button>
                    </div>
                </div>

                ${isVerified ? `
                <!-- Pengaturan Lencana Centang Biru (Accordion Toggle Buka/Tutup) -->
                <div>
                    <button type="button" onclick="Auth.toggleBadgeSettingsPanel()" class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-sky-500/35 text-white transition-all cursor-pointer backdrop-blur-xl shadow-sm">
                        <div class="flex items-center gap-2.5">
                            <i data-lucide="sliders" class="w-4 h-4 text-sky-400"></i>
                            <span class="text-xs font-bold text-white">Atur Lencana Centang Biru</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] text-sky-300 font-medium"></span>
                            <i id="badge-panel-chevron" data-lucide="chevron-down" class="w-4 h-4 text-sky-400 transition-transform duration-200"></i>
                        </div>
                    </button>

                    <div id="badge-settings-content" class="hidden p-4 mt-2 rounded-2xl bg-black/50 border border-sky-500/30 space-y-3.5 backdrop-blur-xl shadow-sm">
                        <div class="flex items-center justify-between pb-2 border-b border-white/10">
                            <span class="text-[11px] text-white/60 font-medium">Kustomisasi Posisi & Warna</span>
                            <button type="button" onclick="Auth.resetBadgeSettings()" class="text-[11px] text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer">
                                Reset Default
                            </button>
                        </div>

                        <div class="space-y-3 text-xs text-white/80">
                            <!-- 1. Jarak Geser Samping -->
                            <div>
                                <div class="flex justify-between items-center mb-1 text-[11px]">
                                    <span class="text-white/70">Jarak Ke Samping (Kiri/Kanan):</span>
                                    <span id="lbl-badge-margin" class="font-mono text-sky-400 font-bold">${badgeS.margin}px</span>
                                </div>
                                <input type="range" id="inp-badge-margin" min="-4" max="24" value="${badgeS.margin}" step="1"
                                    oninput="Auth.updateBadgeControl('margin', this.value)"
                                    class="w-full accent-sky-400 cursor-pointer h-1.5 bg-black/50 rounded-lg">
                            </div>

                            <!-- 2. Ukuran Lencana -->
                            <div>
                                <div class="flex justify-between items-center mb-1 text-[11px]">
                                    <span class="text-white/70">Ukuran Lencana:</span>
                                    <span id="lbl-badge-size" class="font-mono text-sky-400 font-bold">${badgeS.size}px</span>
                                </div>
                                <input type="range" id="inp-badge-size" min="10" max="28" value="${badgeS.size}" step="1"
                                    oninput="Auth.updateBadgeControl('size', this.value)"
                                    class="w-full accent-sky-400 cursor-pointer h-1.5 bg-black/50 rounded-lg">
                            </div>

                            <!-- 3. Posisi Atas - Bawah -->
                            <div>
                                <div class="flex justify-between items-center mb-1 text-[11px]">
                                    <span class="text-white/70">Posisi Vertikal (Atas/Bawah):</span>
                                    <span id="lbl-badge-offsetY" class="font-mono text-sky-400 font-bold">${badgeS.offsetY > 0 ? '+' : ''}${badgeS.offsetY}px</span>
                                </div>
                                <input type="range" id="inp-badge-offsetY" min="-6" max="6" value="${badgeS.offsetY}" step="1"
                                    oninput="Auth.updateBadgeControl('offsetY', this.value)"
                                    class="w-full accent-sky-400 cursor-pointer h-1.5 bg-black/50 rounded-lg">
                            </div>

                            <!-- 4. Pilihan Warna -->
                            <div>
                                <span class="text-[11px] text-white/70 block mb-1.5">Warna Lencana:</span>
                                <div class="flex items-center gap-3">
                                    <button type="button" onclick="Auth.updateBadgeControl('color', '#0095F6')" class="w-7 h-7 rounded-full bg-[#0095F6] border-2 border-white/40 hover:scale-110 active:scale-95 transition cursor-pointer shadow-sm" title="Biru"></button>
                                    <button type="button" onclick="Auth.updateBadgeControl('color', '#10b981')" class="w-7 h-7 rounded-full bg-[#10b981] border-2 border-white/40 hover:scale-110 active:scale-95 transition cursor-pointer shadow-sm" title="Hijau"></button>
                                    <button type="button" onclick="Auth.updateBadgeControl('color', '#18181b')" class="w-7 h-7 rounded-full bg-[#18181b] border-2 border-white/40 hover:scale-110 active:scale-95 transition cursor-pointer shadow-sm" title="Hitam"></button>
                                    <button type="button" onclick="Auth.updateBadgeControl('color', '#ffffff')" class="w-7 h-7 rounded-full bg-[#ffffff] border-2 border-white/40 hover:scale-110 active:scale-95 transition cursor-pointer shadow-sm" title="Putih"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>` : ''}

                <!-- 1.8 Alamat IP Anda (Di atas Username) -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="globe" class="w-3.5 h-3.5 text-cyan-400"></i> Alamat IP Anda
                        </span>
                        <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 flex items-center gap-1 font-mono">
                            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> IP AKTIF
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p id="prof-card-user-ip" class="text-sm font-black text-white font-mono tracking-wide select-all truncate">${es(userIp)}</p>
                        <button onclick="Auth.copyText('${esJs(userIp)}', 'Alamat IP berhasil disalin!')" class="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all" title="Salin IP">
                            <i data-lucide="copy" class="w-3 h-3"></i> Salin
                        </button>
                    </div>
                </div>

                <!-- 1.9 ID Anda (Di bawah Alamat IP Anda) -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="fingerprint" class="w-3.5 h-3.5 text-purple-400"></i> ID Anda
                        </span>
                        <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/25 font-mono">
                            USER ID
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p id="prof-card-user-id" class="text-xs sm:text-sm font-black text-white font-mono tracking-wide select-all truncate">${es(userIdVal)}</p>
                        <button onclick="Auth.copyText('${esJs(userIdVal)}', 'User ID berhasil disalin!')" class="text-[10px] font-bold text-purple-300 hover:text-white bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all" title="Salin ID">
                            <i data-lucide="copy" class="w-3 h-3"></i> Salin
                        </button>
                    </div>
                </div>

                <!-- 2. Ubah Username -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="user" class="w-3.5 h-3.5 text-sky-400"></i> Username
                        </span>
                        <button onclick="Auth.toggleEditField('username')" class="w-7 h-7 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 flex items-center justify-center active:scale-95 transition cursor-pointer" title="Ubah Username">
                            <i data-lucide="pen-line" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <div id="display-field-username" class="flex items-center justify-between">
                        <p class="text-sm font-black text-white truncate">${es(u.username)}</p>
                        <span class="text-[10px] text-white/40">Klik logo pulpen untuk ubah</span>
                    </div>
                    <form id="edit-form-username" onsubmit="Auth.saveEditedUsername(event)" class="hidden space-y-2 pt-1">
                        <input type="text" id="input-edit-username" required minlength="3" value="${es(u.username)}" class="w-full bg-black/60 border border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        <div class="flex justify-end gap-1.5">
                            <button type="button" onclick="Auth.toggleEditField('username')" class="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[10px] font-bold cursor-pointer">Batal</button>
                            <button type="submit" id="btn-save-username" class="px-3.5 py-1.5 rounded-lg bg-sky-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer">
                                <i data-lucide="check" class="w-3 h-3"></i> Simpan
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 3. Ubah Email -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="mail" class="w-3.5 h-3.5 text-emerald-400"></i> Email
                        </span>
                        <button onclick="Auth.toggleEditField('email')" class="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-center active:scale-95 transition cursor-pointer" title="Ubah Email">
                            <i data-lucide="pen-line" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <div id="display-field-email" class="flex items-center justify-between">
                        <p class="text-sm font-bold text-white truncate">${es(u.email)}</p>
                        <span class="text-[10px] text-white/40">Klik logo pulpen untuk ubah</span>
                    </div>
                    <form id="edit-form-email" onsubmit="Auth.saveEditedEmail(event)" class="hidden space-y-2 pt-1">
                        <input type="email" id="input-edit-email" required value="${es(u.email)}" class="w-full bg-black/60 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        <div class="flex justify-end gap-1.5">
                            <button type="button" onclick="Auth.toggleEditField('email')" class="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[10px] font-bold cursor-pointer">Batal</button>
                            <button type="submit" id="btn-save-email" class="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer">
                                <i data-lucide="check" class="w-3 h-3"></i> Simpan
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 4. Ubah Password -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="lock" class="w-3.5 h-3.5 text-amber-400"></i> Password
                        </span>
                        <button type="button" onclick="Auth.toggleEditField('password')" class="w-7 h-7 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 flex items-center justify-center active:scale-95 transition cursor-pointer" title="Ubah Password">
                            <i data-lucide="pen-line" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <div id="display-field-password" class="flex items-center justify-between">
                        <p class="text-sm font-bold text-white tracking-widest font-mono">••••••••</p>
                        <span class="text-[10px] text-white/40">Klik logo pulpen untuk ubah</span>
                    </div>
                    <form id="edit-form-password" onsubmit="Auth.saveEditedPassword(event)" class="hidden space-y-2.5 pt-1">
                        <div>
                            <label class="block text-[10px] font-bold text-white/70 mb-1">Password Baru (min 6 huruf)</label>
                            <input type="password" id="modal-auth-pw-new" minlength="6" required placeholder="Masukkan password baru" class="w-full bg-black/60 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-white/70 mb-1">Konfirmasi Password Baru</label>
                            <input type="password" id="modal-auth-pw-confirm" minlength="6" required placeholder="Ulangi password baru" class="w-full bg-black/60 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        </div>
                        <div class="flex justify-end gap-1.5 pt-1">
                            <button type="button" onclick="Auth.toggleEditField('password')" class="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[10px] font-bold cursor-pointer">Batal</button>
                            <button type="submit" id="btn-save-password" class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer">
                                <i data-lucide="check" class="w-3 h-3"></i> Simpan Password
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 5. Tanggal Bulan Tahun -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="calendar" class="w-3.5 h-3.5 text-cyan-400"></i> Tanggal Bulan Tahun
                        </span>
                        <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 font-mono">
                            KALENDER
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p id="prof-card-live-date" class="text-sm font-black text-white truncate">Memuat tanggal...</p>
                        <span class="text-[10px] text-white/40"></span>
                    </div>
                </div>

                <!-- 6. Waktu Jam Real-Time -->
                <div class="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-xl shadow-sm space-y-2.5 transition-all">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i> Waktu Jam Real-Time
                        </span>
                        <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1 font-mono">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p id="prof-card-live-time" class="text-base sm:text-lg font-black text-white font-mono tracking-wider">00:00:00</p>
                        <span class="text-[10px] text-white/40">Waktu Jam HP Real-Time</span>
                    </div>
                </div>

                <!-- 7. Waktu Mundur Islami (Accordion Buka/Tutup) -->
                <div>
                    <button type="button" onclick="Auth.toggleIslamicCountdownPanel()" class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 hover:border-emerald-500/40 text-white transition-all cursor-pointer backdrop-blur-xl shadow-sm select-none active:scale-[0.99]">
                        <div class="flex items-center gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <i data-lucide="moon" class="w-4 h-4"></i>
                            </div>
                            <div class="text-left">
                                <span class="text-xs font-bold text-white block leading-tight">Waktu Mundur Islami</span>
                                <span class="text-[10px] text-white/50 leading-tight">Ramadhan, Idul Fitri, & Idul Adha</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] text-emerald-300 font-bold"></span>
                            <i id="islamic-panel-chevron" data-lucide="chevron-down" class="w-4 h-4 text-emerald-400 transition-transform duration-200"></i>
                        </div>
                    </button>

                    <div id="islamic-countdown-content" class="hidden p-3.5 mt-2 rounded-2xl bg-black/40 border border-emerald-500/25 space-y-3 backdrop-blur-xl shadow-sm transition-all duration-300">
                        <!-- Filter Chips Tabs -->
                        <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 -mx-1 px-1">
                            <button onclick="IslamicClock.setTab('ramadhan')" class="prof-islamic-tab-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 bg-white text-black shadow-md border border-white">
                                <i data-lucide="moon" class="w-3.5 h-3.5"></i>
                                <span>Ramadhan</span>
                            </button>
                            <button onclick="IslamicClock.setTab('idul_fitri')" class="prof-islamic-tab-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 bg-white/[0.08] hover:bg-white/[0.14] text-white/80 border border-white/20">
                                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                                <span>Idul Fitri</span>
                            </button>
                            <button onclick="IslamicClock.setTab('idul_adha')" class="prof-islamic-tab-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 bg-white/[0.08] hover:bg-white/[0.14] text-white/80 border border-white/20">
                                <i data-lucide="heart-handshake" class="w-3.5 h-3.5"></i>
                                <span>Idul Adha</span>
                            </button>
                        </div>

                        <!-- Countdown Area in Profile Card -->
                        <div id="prof-islamic-countdown-area" class="space-y-2 pt-1"></div>
                    </div>
                </div>

                <!-- Footer: Bergabung Info + Tombol Hapus Akun & Keluar Akun -->
                <div class="pt-3 border-t border-white/10 space-y-3">
                    <div class="flex items-center justify-between text-xs text-white/50 px-1">
                        <span>Bergabung: ${joinDate}</span>
                        ${isVerified ? `<span class="text-purple-400 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30"></span>` : ''}
                    </div>
                    <div class="flex items-center justify-between gap-3 pt-1">
                        <button type="button" onclick="Auth.confirmDeleteAccount()" class="text-xs px-4 py-2.5 rounded-full bg-red-600/15 hover:bg-red-600/25 border border-red-500/35 text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm" title="Hapus Akun Permanen">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i>
                            <span>Hapus Akun</span>
                        </button>
                        <button type="button" onclick="gid('user-profile-modal')?.remove(); Auth.logout();" class="text-xs px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm" title="Keluar Akun">
                            <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                            <span>Keluar Akun</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        if (typeof IslamicClock !== 'undefined' && IslamicClock.init) {
            IslamicClock.init();
        }
        if (window.lucide) lucide.createIcons();

        // Async detect real client IP for profile card
        fetch('/api/user-auth?action=me', { cache: 'no-store' })
            .then(function(r){ return r.json(); })
            .then(function(d){
                if (d && (d.clientIp || d.ip || (d.user && d.user.ip))) {
                    var detectedIp = d.clientIp || d.ip || d.user.ip;
                    Auth.clientIp = detectedIp;
                    var ipEl = gid('prof-card-user-ip');
                    if (ipEl && ipEl.innerText !== detectedIp) {
                        ipEl.innerText = detectedIp;
                    }
                }
            })
            .catch(function(){});
    },

    confirmDeleteAccount() {
        var existing = gid('confirm-delete-account-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'confirm-delete-account-modal';
        modal.className = 'fixed inset-0 z-[700] flex items-center justify-center p-4 animate-fadeIn';
        modal.innerHTML = `
            <div onclick="gid('confirm-delete-account-modal')?.remove()" class="fixed inset-0 bg-black/85 backdrop-blur-md"></div>
            <div class="relative z-10 w-full max-w-sm bg-[#141620] border border-red-500/40 rounded-3xl p-6 shadow-2xl shadow-red-950/50 text-center space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                    <i data-lucide="alert-triangle" class="w-7 h-7 text-red-400"></i>
                </div>
                <div>
                    <h3 class="text-white font-black text-lg">Hapus Akun Permanen?</h3>
                    <p class="text-white/70 text-xs mt-1 leading-relaxed">
                        Tindakan ini <strong class="text-red-400">tidak dapat dibatalkan</strong>. Semua data akun, username, dan sesi Anda akan dihapus permanen dari sistem.
                    </p>
                </div>
                <div class="flex gap-2.5 pt-2">
                    <button type="button" onclick="gid('confirm-delete-account-modal')?.remove()" class="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs active:scale-95 transition cursor-pointer">
                        Batal
                    </button>
                    <button type="button" id="btn-do-delete-account" onclick="Auth.deleteAccount()" class="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shadow-lg shadow-red-600/30 cursor-pointer">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        <span>Ya, Hapus</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }
    },

    async deleteAccount() {
        var btn = gid('btn-do-delete-account');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Menghapus...</span>';
        }

        try {
            var token = Auth.token || localStorage.getItem('musifystar_auth_token') || sessionStorage.getItem('musifystar_auth_token');
            var res = await fetch('/api/user-auth?action=delete_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            var data = await res.json();
            if (data && data.status) {
                gid('confirm-delete-account-modal')?.remove();
                gid('user-profile-modal')?.remove();
                await Auth.logout(false);
                showToast('Akun Anda berhasil dihapus permanen.');
                setTimeout(function() {
                    if (typeof Profile !== 'undefined' && Profile.render) Profile.render();
                }, 100);
            } else {
                showToast(data?.message || 'Gagal menghapus akun');
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4"></i><span>Ya, Hapus</span>';
                    if (window.lucide) lucide.createIcons();
                }
            }
        } catch(e) {
            showToast('Terjadi kesalahan jaringan saat menghapus akun');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4"></i><span>Ya, Hapus</span>';
                if (window.lucide) lucide.createIcons();
            }
        }
    },

    toggleEditField(fieldName) {
        var displayEl = gid('display-field-' + fieldName);
        var formEl = gid('edit-form-' + fieldName);
        if (!displayEl || !formEl) return;
        if (formEl.classList.contains('hidden')) {
            formEl.classList.remove('hidden');
            displayEl.classList.add('hidden');
            var input = formEl.querySelector('input');
            if (input) input.focus();
        } else {
            formEl.classList.add('hidden');
            displayEl.classList.remove('hidden');
        }
    },

    triggerGalleryUpload() {
        var input = gid('auth-gallery-file-input');
        if (input) {
            input.value = '';
            input.click();
        }
    },

    uploadAvatarFromGallery(event) {
        var file = event.target.files && event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Hanya file gambar dari galeri yang didukung');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var size = 300;
                canvas.width = size;
                canvas.height = size;
                var ctx = canvas.getContext('2d');

                var minDim = Math.min(img.width, img.height);
                var sx = (img.width - minDim) / 2;
                var sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

                var base64Data = canvas.toDataURL('image/jpeg', 0.85);
                Auth.saveAvatar(base64Data);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    async saveAvatar(base64Data) {
        if (!Auth.token) {
            showToast('Silakan login terlebih dahulu');
            return;
        }
        showToast('Menyimpan foto profil dari galeri...');
        try {
            var res = await fetch('/api/user-auth?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.token
                },
                body: JSON.stringify({ avatar: base64Data })
            });
            var data = await res.json();
            if (data && data.status && data.user) {
                Auth.currentUser = data.user;
                if (localStorage.getItem('musifystar_auth_token')) {
                    localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                }
                showToast('Foto profil berhasil diubah!');
                Auth.updateHeaderUI();
                Auth.openUserProfileModal();
            } else {
                showToast(data?.message || 'Gagal mengubah foto');
            }
        } catch(e) {
            showToast('Koneksi bermasalah saat upload');
        }
    },

    async saveEditedUsername(e) {
        if (e && e.preventDefault) e.preventDefault();
        var newUsername = (gid('input-edit-username')?.value || '').trim();
        if (!newUsername || newUsername.length < 3) {
            showToast('Username minimal 3 karakter');
            return;
        }

        var btn = gid('btn-save-username');
        if (btn) btn.disabled = true;

        try {
            var res = await fetch('/api/user-auth?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.token
                },
                body: JSON.stringify({ username: newUsername })
            });
            var data = await res.json();
            if (data && data.status && data.user) {
                Auth.currentUser = data.user;
                if (localStorage.getItem('musifystar_auth_token')) {
                    localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                }
                showToast('Username berhasil diperbarui!');
                Auth.updateHeaderUI();
                Auth.openUserProfileModal();
            } else {
                showToast(data?.message || 'Gagal mengubah username');
            }
        } catch(err) {
            showToast('Koneksi bermasalah');
        }
    },

    async saveEditedEmail(e) {
        if (e && e.preventDefault) e.preventDefault();
        var newEmail = (gid('input-edit-email')?.value || '').trim();
        if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            showToast('Format email tidak valid');
            return;
        }

        var btn = gid('btn-save-email');
        if (btn) btn.disabled = true;

        try {
            var res = await fetch('/api/user-auth?action=update_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.token
                },
                body: JSON.stringify({ email: newEmail })
            });
            var data = await res.json();
            if (data && data.status && data.user) {
                Auth.currentUser = data.user;
                if (localStorage.getItem('musifystar_auth_token')) {
                    localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                }
                showToast('Email berhasil diperbarui!');
                Auth.updateHeaderUI();
                Auth.openUserProfileModal();
            } else {
                showToast(data?.message || 'Gagal mengubah email');
            }
        } catch(err) {
            showToast('Koneksi bermasalah');
        }
    },

    async saveEditedPassword(e) {
        if (e && e.preventDefault) e.preventDefault();
        var newPw = (gid('modal-auth-pw-new')?.value || '').trim();
        var confirmPw = (gid('modal-auth-pw-confirm')?.value || '').trim();

        if (newPw.length < 6) {
            showToast('Password minimal 6 karakter');
            return;
        }
        if (newPw !== confirmPw) {
            showToast('Konfirmasi password tidak cocok');
            return;
        }

        var btn = gid('btn-save-password');
        if (btn) btn.disabled = true;

        try {
            var res = await fetch('/api/user-auth?action=update_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.token
                },
                body: JSON.stringify({ newPassword: newPw })
            });
            var data = await res.json();
            if (data && data.status) {
                showToast('Password berhasil diubah!');
                Auth.toggleEditField('password');
            } else {
                showToast(data?.message || 'Gagal mengubah password');
            }
        } catch(err) {
            showToast('Koneksi bermasalah');
        }
    },

    async handleLogin(e, prefix) {
        if (e && e.preventDefault) e.preventDefault();
        prefix = prefix || 'header-';
        var userInput = (gid(prefix + 'auth-login-username')?.value || '').trim();
        var email = (gid(prefix + 'auth-login-email')?.value || '').trim();
        var username = userInput;
        if (!email && userInput.includes('@')) {
            email = userInput;
        }
        var password = (gid(prefix + 'auth-login-password')?.value || '').trim();
        var remember = true;

        var btn = gid(prefix + 'auth-login-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Signing in...</span>';
            if (window.lucide && typeof window.lucide.createIcons === 'function') try{ window.lucide.createIcons(); }catch(err){}
        }

        try {
            var res = await fetch('/api/user-auth?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, email: email, password: password, rememberMe: remember })
            });
            var data = {};
            try {
                data = await res.json();
            } catch(e) {}

            if (data && (data.banned || (data.ban && data.ban.isBanned))) {
                var canonicalUsername = data.user?.username || username;
                var canonicalEmail = data.user?.rawEmail || data.user?.email || email;
                var canonicalUserId = data.user?.id || '';
                Auth.activeBannedUser = { username: canonicalUsername, email: canonicalEmail, userId: canonicalUserId };
                try {
                    localStorage.setItem('musifystar_active_ban', JSON.stringify({
                        ban: data.ban,
                        user: Auth.activeBannedUser,
                        timestamp: Date.now()
                    }));
                } catch(e) {}
                gid('header-auth-dropdown-wrapper')?.remove();
                Auth.showBanModal(data.ban);
            } else if (data && data.status && data.token) {
                try { localStorage.removeItem('musifystar_active_ban'); } catch(e) {}
                Auth.token = data.token;
                Auth.currentUser = data.user;
                if (remember) {
                    localStorage.setItem('musifystar_auth_token', data.token);
                    localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                    sessionStorage.removeItem('musifystar_auth_token');
                    sessionStorage.removeItem('musifystar_auth_user');
                } else {
                    sessionStorage.setItem('musifystar_auth_token', data.token);
                    sessionStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                    localStorage.removeItem('musifystar_auth_token');
                    localStorage.removeItem('musifystar_auth_user');
                }
                showToast('Selamat datang, ' + data.user.username + '!');
                gid('header-auth-dropdown-wrapper')?.remove();
                Auth.updateHeaderUI();

                if (data.ban && (data.ban.isBanned || data.ban.isWarning)) {
                    Auth.showBanModal(data.ban);
                }
            } else {
                showToast(data?.message || 'Login gagal, periksa data Anda');
            }
        } catch (err) {
            showToast('Terjadi kesalahan jaringan');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>Sign in</span>';
                if (window.lucide && typeof window.lucide.createIcons === 'function') try{ window.lucide.createIcons(); }catch(err){}
            }
        }
    },

    async handleRegister(e, prefix) {
        if (e && e.preventDefault) e.preventDefault();
        prefix = prefix || 'header-';
        var username = (gid(prefix + 'auth-reg-username')?.value || '').trim();
        var email = (gid(prefix + 'auth-reg-email')?.value || '').trim();
        var password = (gid(prefix + 'auth-reg-password')?.value || '').trim();

        if (password.length < 6) {
            showToast('Password minimal 6 karakter/huruf');
            return;
        }

        var btn = gid(prefix + 'auth-reg-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Signing up...</span>';
            if (window.lucide && typeof window.lucide.createIcons === 'function') try{ window.lucide.createIcons(); }catch(err){}
        }

        try {
            var res = await fetch('/api/user-auth?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, email: email, password: password })
            });
            var data = await res.json();
            if (data && data.status && data.token) {
                Auth.token = data.token;
                Auth.currentUser = data.user;
                localStorage.setItem('musifystar_auth_token', data.token);
                localStorage.setItem('musifystar_auth_user', JSON.stringify(data.user));
                showToast('Pendaftaran berhasil! Selamat datang, ' + data.user.username);
                gid('header-auth-dropdown-wrapper')?.remove();
                Auth.updateHeaderUI();
            } else {
                showToast(data?.message || 'Pendaftaran gagal');
            }
        } catch (err) {
            showToast('Terjadi kesalahan koneksi');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>Sign up</span>';
                if (window.lucide && typeof window.lucide.createIcons === 'function') try{ window.lucide.createIcons(); }catch(err){}
            }
        }
    },

    async logout(notify = true) {
        if (Auth.token) {
            try {
                fetch('/api/user-auth?action=logout', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + Auth.token }
                });
            } catch(e) {}
        }
        Auth.token = null;
        Auth.currentUser = null;
        localStorage.removeItem('musifystar_auth_token');
        localStorage.removeItem('musifystar_auth_user');
        sessionStorage.removeItem('musifystar_auth_token');
        sessionStorage.removeItem('musifystar_auth_user');
        try {
            sessionStorage.removeItem('musifystar_admin_token');
            localStorage.removeItem('musifystar_admin_token');
            localStorage.removeItem('musifystar_sent_chat_ids');
        } catch(e) {}
        if (typeof GlobalChat !== 'undefined' && typeof GlobalChat.close === 'function') {
            GlobalChat.close();
        }
        gid('header-auth-dropdown-wrapper')?.remove();
        Auth.updateHeaderUI();
        if (notify) showToast('Anda telah keluar dari akun');
    },

    showBanModal(ban) {
        if (!ban) return;
        var existing = gid('user-banned-banner-modal');
        if (existing) existing.remove();

        var isIpBanned = !!(ban.isIpBanned || ban.ipBanned);
        var isBanned = !!(ban.isBanned || isIpBanned);

        var titleText = isIpBanned ? 'ALAMAT IP DIBANNED' : (isBanned ? 'AKUN ANDA DIBANNED' : 'PERINGATAN DARI ADMIN');
        var iconClass = isIpBanned ? 'text-red-500 animate-pulse' : (isBanned ? 'text-rose-500 animate-pulse' : 'text-amber-400 animate-bounce');
        var iconName = isIpBanned ? 'wifi-off' : (isBanned ? 'shield-alert' : 'alert-triangle');
        var borderClass = isIpBanned ? 'border-red-600/70 shadow-red-600/40' : (isBanned ? 'border-rose-500/50 shadow-rose-500/30' : 'border-amber-500/50 shadow-amber-500/30');
        var badgeClass = isIpBanned ? 'bg-red-600/30 text-red-200 border-red-500/60' : (isBanned ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40');

        var banTypeLabel = isIpBanned ? 'BANNED IP ADDRESS (BLACKLIST)' : 'dibanned permanen';
        if (!isIpBanned) {
            if (ban.banType === 'temporary') {
                banTypeLabel = 'dibanned sementara';
            } else if (ban.banType === 'warning') {
                banTypeLabel = 'peringatan';
            }
        } else {
            if (ban.banType === 'temporary') {
                banTypeLabel = 'IP DIBANNED SEMENTARA';
            }
        }

        var durationInfo = '';
        if (ban.banDurationText) {
            durationInfo = `<p class="text-xs sm:text-sm font-bold text-amber-300 tracking-wide mt-1">DURASI DIBANNED : ${ban.banDurationText}</p>`;
        } else if (ban.banType === 'permanent' || isIpBanned) {
            durationInfo = `<p class="text-xs sm:text-sm font-bold text-rose-400 tracking-wide mt-1">DURASI DIBANNED : Permanen</p>`;
        }

        var expiresInfo = '';
        if (ban.banExpiresAt) {
            try {
                var expDate = new Date(ban.banExpiresAt);
                var dateStr = expDate.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':');
                expiresInfo = `<p class="text-[11px] font-semibold text-white/70 mt-0.5">Berlaku ${dateStr} WIB</p>`;
            } catch(e){}
        }

        var ipNotice = isIpBanned && ban.ip ? `<p class="text-xs font-mono text-red-300 bg-black/50 py-1.5 px-3 rounded-lg border border-red-500/30 inline-block">🌐 Target IP: ${ban.ip}</p>` : '';

        var modal = document.createElement('div');
        modal.id = 'user-banned-banner-modal';
        modal.dataset.banCategory = isIpBanned ? 'ip' : 'account';
        modal.className = 'fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none pointer-events-auto';
        modal.innerHTML = `
            <div class="relative w-full max-w-md bg-[#12141c] border ${borderClass} rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-scaleIn">
                <!-- Icon Glow -->
                <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                    <i data-lucide="${iconName}" class="w-9 h-9 ${iconClass}"></i>
                </div>

                <!-- Title & Status Badge -->
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${badgeClass}">
                        <span class="w-2 h-2 rounded-full ${isBanned ? 'bg-rose-500' : 'bg-amber-400'} animate-ping"></span>
                        <span>${banTypeLabel}</span>
                    </div>
                    <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">${titleText}</h2>
                    ${ipNotice}
                    ${durationInfo}
                    ${expiresInfo}
                </div>

                <!-- Message Card in Middle -->
                <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5 shadow-inner">
                    <span class="text-[10px] font-bold text-white/50 uppercase tracking-wider block">ALASAN DIBAN</span>
                    <p class="text-xs sm:text-sm text-white/90 leading-relaxed font-medium whitespace-pre-wrap">${ban.banReason || 'Jaringan / IP Address Anda telah dimasukkan ke dalam daftar hitam (blacklist) oleh admin.'}</p>
                </div>

                <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300/80 leading-snug">
                    ${isIpBanned ? 'Akses jaringan dari IP Address ini diblokir total oleh server. Hubungi administrator jika Anda merasa ini kekeliruan.' : 'Akun ini dibanned oleh sistem dan tidak dapat dipulihkan, silahkan anda keluar dari akun ini thankyou'}
                </div>

                <!-- Action Buttons: Cek Status & Keluar Akun -->
                <div class="space-y-2">
                    <button onclick="Auth.checkBanStatusNow()" class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        <span>${isIpBanned ? 'Cek Status IP' : 'Cek Status Akun'}</span>
                    </button>
                    ${!isIpBanned ? `<button onclick="Auth.logoutAndReload()" class="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>LOGOUT AKUN</span>
                    </button>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch(e){}
        }

        // Auto polling check every 5 seconds while banner is visible
        if (window._banModalPollTimer) clearInterval(window._banModalPollTimer);
        window._banModalPollTimer = setInterval(function() {
            if (!gid('user-banned-banner-modal')) {
                clearInterval(window._banModalPollTimer);
                return;
            }
            Auth.checkBanStatusNow(true);
        }, 5000);
    },

    async checkBanStatusNow(silent = false) {
        try {
            var isExplicitlyUnbanned = false;
            var modal = gid('user-banned-banner-modal');
            var isIpBan = modal ? modal.dataset.banCategory === 'ip' : false;

            if (isIpBan) {
                // IP Ban check: query server to see if IP blacklist has been lifted
                var resIp = await fetch('/api/user-auth?action=me', { cache: 'no-store' });
                var dataIp = await resIp.json();
                if (dataIp && dataIp.status && !dataIp.ipBanned && (!dataIp.ban || !dataIp.ban.isIpBanned)) {
                    isExplicitlyUnbanned = true;
                }
            } else {
                // Account Ban check: ONLY check the account!
                var target = Auth.activeBannedUser || Auth.currentUser;
                var url = '/api/user-auth?action=check_account_ban';
                if (target) {
                    url += '&username=' + encodeURIComponent(target.username || '') +
                           '&userId=' + encodeURIComponent(target.userId || target.id || '') +
                           '&email=' + encodeURIComponent(target.rawEmail || target.email || '');
                }
                var headers = {};
                if (Auth.token) headers['Authorization'] = 'Bearer ' + Auth.token;
                var resBan = await fetch(url, { headers: headers, cache: 'no-store' });
                var dataBan = await resBan.json();
                if (dataBan && dataBan.status && dataBan.banned === false && dataBan.unbanned === true) {
                    isExplicitlyUnbanned = true;
                }
            }

            if (isExplicitlyUnbanned) {
                if (window._banModalPollTimer) clearInterval(window._banModalPollTimer);
                Auth.activeBannedUser = null;
                try { localStorage.removeItem('musifystar_active_ban'); } catch(e) {}
                if (modal) modal.remove();
                if (typeof showToast === 'function') {
                    showToast('Selamat! Blokir / Banned akun Anda telah dibuka oleh administrator.');
                }
                setTimeout(function() { window.location.reload(); }, 600);
            } else if (!silent) {
                if (typeof showToast === 'function') {
                    showToast('Status Anda masih dalam sanksi dibanned / blacklist.');
                }
            }
        } catch(e) {
            if (!silent && typeof showToast === 'function') {
                showToast('Gagal terhubung ke server');
            }
        }
    },

    logoutAndReload() {
        if (window._banModalPollTimer) clearInterval(window._banModalPollTimer);
        if (window._realtimeBanMonitorTimer) clearInterval(window._realtimeBanMonitorTimer);
        Auth.activeBannedUser = null;
        Auth.currentUser = null;
        Auth.token = null;
        try {
            localStorage.removeItem('musifystar_auth_token');
            localStorage.removeItem('musifystar_auth_user');
            sessionStorage.removeItem('musifystar_auth_token');
            sessionStorage.removeItem('musifystar_auth_user');
            localStorage.removeItem('musifystar_active_ban');
        } catch(e) {}
        var modal = gid('user-banned-banner-modal');
        if (modal) modal.remove();
        setTimeout(function() {
            window.location.reload();
        }, 50);
    }
};

window.Auth = Auth;
