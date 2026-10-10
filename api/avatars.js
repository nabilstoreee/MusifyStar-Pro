const fs = require('fs');
const path = require('path');
const storage = require('./storage.js');
const adminAuth = require('./admin-auth.js');

// Default catalog kosong (hanya diisi jika Admin menambahkan avatar)
const DEFAULT_AVATARS = [];

const OLD_DEFAULT_IDS = new Set([
    'av_vip_cewe_sakura', 'av_vip_cewe_aoi', 'av_vip_cewe_hana',
    'av_1791499846347_nbsi', 'av_1791499998616_tj02',
    'av_1791500017306_zlth', 'av_1791499953107_h27l'
]);

async function getAvatarsCatalog() {
    try {
        const data = await storage.readDataAsync('avatars_catalog.json');
        if (data && Array.isArray(data.avatars)) {
            // Clean up any old hardcoded default avatars
            const filtered = data.avatars.filter(a => 
                !OLD_DEFAULT_IDS.has(a.id) && 
                !a.url.includes('unsplash.com/photo-') &&
                !a.url.includes('dicebear.com/7.x/lorelei') &&
                !a.url.includes('/avatars/Avatar-MusifyStar-')
            );
            if (filtered.length !== data.avatars.length) {
                await saveAvatarsCatalog(filtered);
            }
            return filtered;
        }
    } catch (e) {}
    return DEFAULT_AVATARS;
}

async function saveAvatarsCatalog(avatars) {
    await storage.writeDataAsync('avatars_catalog.json', {
        avatars: avatars,
        updatedAt: Date.now()
    });
}

module.exports = async function handler(req, res) {
    const action = req.query.action || (req.body && req.body.action) || 'list';

    // GET /api/avatars - Ambil katalog avatar
    if (req.method === 'GET' || action === 'list') {
        const avatars = await getAvatarsCatalog();
        return res.json({
            status: true,
            avatars: avatars
        });
    }

    // POST Actions
    if (req.method === 'POST') {
        const token = req.headers['x-admin-token'] || req.headers['authorization'];
        const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : '';
        const isAdmin = adminAuth.isValidToken(cleanToken);

        // Hanya Master Admin / Admin terautentikasi yang bisa kelola
        if (!isAdmin) {
            return res.status(403).json({
                status: false,
                message: 'Akses khusus Administrator. Token tidak valid.'
            });
        }

        const body = req.body || {};

        // Tambah Avatar Baru
        if (action === 'add') {
            let { name, url, fileBase64, isPremium, category, targetTab } = body;

            // Tentukan target category & isPremium berdasarkan targetTab
            // Pilihan: 'gratis' (Campur) | 'cowo' (VIP Cowok) | 'cewe' (VIP Cewek)
            let chosenCategory = 'gratis';
            let chosenPremium = false;

            const tab = targetTab || category;
            if (tab === 'cowo' || tab === 'vip_cowo') {
                chosenCategory = 'cowo';
                chosenPremium = true;
            } else if (tab === 'cewe' || tab === 'vip_cewe') {
                chosenCategory = 'cewe';
                chosenPremium = true;
            } else if (tab === 'vip') {
                chosenCategory = 'cowo';
                chosenPremium = true;
            } else {
                chosenCategory = 'gratis';
                chosenPremium = false;
            }

            // Jika diupload dari galeri HP/PC berupa base64 gambar
            if (fileBase64 && typeof fileBase64 === 'string') {
                try {
                    const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(fileBase64, 'base64');
                    
                    const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
                    if (!fs.existsSync(avatarsDir)) {
                        fs.mkdirSync(avatarsDir, { recursive: true });
                    }

                    const fileName = `Avatar-MusifyStar-${Date.now()}.png`;
                    const targetPath = path.join(avatarsDir, fileName);
                    fs.writeFileSync(targetPath, buffer);

                    url = `/avatars/${fileName}?v=${Date.now()}`;
                } catch(err) {
                    console.error('[AVATARS_API] Gagal menyimpan file avatar:', err.message);
                    return res.status(500).json({ status: false, message: 'Gagal memproses file gambar avatar' });
                }
            }

            if (!url || !url.trim()) {
                return res.status(400).json({ status: false, message: 'Foto / Gambar Avatar wajib dipilih dari galeri atau diisi URL' });
            }

            const current = await getAvatarsCatalog();
            const newAvatar = {
                id: 'av_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: (name || (chosenPremium ? (chosenCategory === 'cewe' ? 'VIP Girl ' : 'VIP Boy ') : 'Avatar Gratis ') + (current.length + 1)).trim(),
                url: url.trim(),
                isPremium: chosenPremium,
                category: chosenCategory,
                addedAt: Date.now()
            };

            current.unshift(newAvatar);
            await saveAvatarsCatalog(current);

            const tabLabel = !chosenPremium ? 'Avatar Gratis (Campur)' : (chosenCategory === 'cewe' ? 'Avatar VIP (Cewek)' : 'Avatar VIP (Cowok)');

            return res.json({
                status: true,
                message: `Avatar berhasil ditambahkan ke tab ${tabLabel}!`,
                avatar: newAvatar,
                avatars: current
            });
        }

        // Ubah Kategori / Tab Avatar (Gratis, VIP Cowo, VIP Cewe)
        if (action === 'set_category' || action === 'update_category' || action === 'toggle_premium') {
            const { id, category, isPremium } = body;
            if (!id) return res.status(400).json({ status: false, message: 'ID avatar wajib ada' });

            const current = await getAvatarsCatalog();
            const target = current.find(a => a.id === id);
            if (!target) return res.status(404).json({ status: false, message: 'Avatar tidak ditemukan' });

            if (category) {
                if (category === 'gratis') {
                    target.category = 'gratis';
                    target.isPremium = false;
                } else if (category === 'cowo') {
                    target.category = 'cowo';
                    target.isPremium = true;
                } else if (category === 'cewe') {
                    target.category = 'cewe';
                    target.isPremium = true;
                }
            } else if (isPremium !== undefined) {
                target.isPremium = Boolean(isPremium);
                if (!target.isPremium) {
                    target.category = 'gratis';
                } else if (target.category === 'gratis' || !target.category) {
                    target.category = 'cowo';
                }
            }

            await saveAvatarsCatalog(current);

            const tabLabel = !target.isPremium ? 'Avatar Gratis (Campur)' : (target.category === 'cewe' ? 'Avatar VIP (Cewek)' : 'Avatar VIP (Cowok)');

            return res.json({
                status: true,
                message: `Status avatar dipindahkan ke: ${tabLabel}`,
                avatar: target,
                avatars: current
            });
        }

        // Hapus Avatar
        if (action === 'delete') {
            const { id } = body;
            if (!id) return res.status(400).json({ status: false, message: 'ID avatar wajib' });

            let current = await getAvatarsCatalog();
            current = current.filter(a => a.id !== id);
            await saveAvatarsCatalog(current);

            return res.json({
                status: true,
                message: 'Avatar berhasil dihapus',
                avatars: current
            });
        }

        // Reset ke Default
        if (action === 'reset_default') {
            await saveAvatarsCatalog(DEFAULT_AVATARS);
            return res.json({
                status: true,
                message: 'Katalog avatar di-reset ke setelan awal',
                avatars: DEFAULT_AVATARS
            });
        }

        return res.status(400).json({ status: false, message: 'Aksi tidak dikenali' });
    }

    return res.status(405).json({ status: false, message: 'Metode HTTP tidak didukung' });
};
