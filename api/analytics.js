const fs = require('fs');
const path = require('path');
const adminAuth = require('./admin-auth.js');
const storage = require('./storage.js');

const ANALYTICS_FILE = '.analytics_data.json';

// In-memory active listeners store: sessionId -> { sessionId, title, artist, lastSeen, isPlaying, startedPlayingAt, listeningSeconds, device, id, image }
const activeSessions = new Map();
// Track sessions already counted in device totals
const recordedSessionDevices = new Set();
// Track sessions already counted in session duration count
const recordedSessionDurations = new Map();

function getInitialAnalytics() {
    // 100% Real-time clean slate
    const initialHourly = {};
    for (let i = 0; i < 24; i++) {
        initialHourly[i] = 0;
    }

    return {
        hourly: initialHourly,
        searches: {},
        songPlays: [], // Array of { id, title, artist, image, duration, album, playedAt }
        totalPlays: 0,
        totalSearches: 0,
        duration: {
            totalListeningSeconds: 0,
            totalSessions: 0,
            distribution: {
                quick: 0,      // < 5 mnt
                short: 0,      // 5 - 15 mnt
                medium: 0,     // 15 - 30 mnt
                long: 0,       // 30 - 60 mnt
                extended: 0    // > 60 mnt
            }
        },
        devices: {
            android_apk: 0,
            pwa_chrome: 0,
            safari_ios: 0,
            desktop_web: 0
        },
        totalDeviceCount: 0
    };
}

let analyticsData = null;

function loadAnalytics() {
    const initial = getInitialAnalytics();
    const parsed = storage.readData(ANALYTICS_FILE, null);
    if (parsed && typeof parsed === 'object') {
        const now = Date.now();
        if (Array.isArray(parsed.activeSessions)) {
            for (const sess of parsed.activeSessions) {
                if (sess && sess.sessionId && (now - sess.lastSeen <= 90 * 1000)) {
                    if (!activeSessions.has(sess.sessionId) || (activeSessions.get(sess.sessionId).lastSeen < sess.lastSeen)) {
                        activeSessions.set(sess.sessionId, sess);
                    }
                }
            }
        }

        analyticsData = {
            hourly: parsed.hourly || initial.hourly,
            searches: parsed.searches || {},
            songPlays: Array.isArray(parsed.songPlays) ? parsed.songPlays : [],
            totalPlays: parsed.totalPlays || 0,
            totalSearches: parsed.totalSearches || 0,
            duration: parsed.duration || initial.duration,
            devices: parsed.devices || initial.devices,
            totalDeviceCount: parsed.totalDeviceCount || 0,
            activeSessions: Array.isArray(parsed.activeSessions) ? parsed.activeSessions : []
        };
        return analyticsData;
    }

    analyticsData = initial;
    saveAnalytics();
    return analyticsData;
}

function saveAnalytics() {
    if (analyticsData) {
        analyticsData.activeSessions = Array.from(activeSessions.values());
        storage.writeData(ANALYTICS_FILE, analyticsData);
    }
}

function detectDeviceCategory(bodyDevice, userAgent) {
    if (bodyDevice && ['android_apk', 'pwa_chrome', 'safari_ios', 'desktop_web'].includes(bodyDevice)) {
        return bodyDevice;
    }
    const ua = String(userAgent || '').toLowerCase();
    if (ua.includes('musifystarapk') || (ua.includes('wv') && ua.includes('android'))) {
        return 'android_apk';
    }
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod') || (ua.includes('mac') && ua.includes('safari') && !ua.includes('chrome'))) {
        return 'safari_ios';
    }
    if (ua.includes('android')) {
        return 'android_apk';
    }
    if (ua.includes('chrome') || ua.includes('crios')) {
        return 'pwa_chrome';
    }
    return 'desktop_web';
}

function recordSearch(query) {
    if (!query || typeof query !== 'string') return;
    const clean = query.trim().toLowerCase();
    if (clean.length < 2) return;

    const data = loadAnalytics();
    data.totalSearches = (data.totalSearches || 0) + 1;
    if (!data.searches) data.searches = {};

    if (data.searches[clean]) {
        data.searches[clean].count += 1;
        data.searches[clean].lastSearched = Date.now();
    } else {
        data.searches[clean] = {
            query: clean,
            count: 1,
            lastSearched: Date.now()
        };
    }
    saveAnalytics();
}

function recordHeartbeat(sessionInfo, userAgent) {
    const data = loadAnalytics();
    const now = Date.now();
    const sessionId = sessionInfo.sessionId || 'anon_' + Math.random().toString(36).substring(2, 9);
    const isPlaying = Boolean(sessionInfo.isPlaying);
    const title = sessionInfo.title ? String(sessionInfo.title).trim() : '';
    const artist = sessionInfo.artist ? String(sessionInfo.artist).trim() : '';
    const songId = sessionInfo.id || sessionInfo.videoId || sessionInfo.songId || '';
    const image = sessionInfo.image || sessionInfo.cover || sessionInfo.thumbnail || '';
    const duration = sessionInfo.duration || '';
    const album = sessionInfo.album || '';
    const deviceType = detectDeviceCategory(sessionInfo.device, userAgent);

    const prevSession = activeSessions.get(sessionId);

    // Parse and attach user profile if provided
    const userRaw = sessionInfo.user || (prevSession && prevSession.user) || null;
    let userInfo = null;
    if (userRaw && typeof userRaw === 'object' && (userRaw.username || userRaw.email || userRaw.name || userRaw.id)) {
        userInfo = {
            id: userRaw.id ? String(userRaw.id) : '',
            username: userRaw.username ? String(userRaw.username) : (userRaw.name ? String(userRaw.name) : 'Pengguna'),
            name: userRaw.name ? String(userRaw.name) : (userRaw.username ? String(userRaw.username) : 'Pengguna'),
            email: userRaw.email ? String(userRaw.email) : '',
            avatar: userRaw.avatar ? String(userRaw.avatar) : '',
            isLoggedIn: Boolean(userRaw.id || userRaw.email || (userRaw.username && userRaw.username.toLowerCase() !== 'tamu'))
        };
    } else {
        userInfo = {
            id: '',
            username: 'Tamu (Belum Login)',
            name: 'Pengguna Tamu',
            email: '',
            avatar: '',
            isLoggedIn: false
        };
    }

    // 1. Device Breakdown Recording (Counted once per unique session)
    if (!recordedSessionDevices.has(sessionId)) {
        recordedSessionDevices.add(sessionId);
        if (!data.devices) {
            data.devices = { android_apk: 0, pwa_chrome: 0, safari_ios: 0, desktop_web: 0 };
        }
        data.devices[deviceType] = (data.devices[deviceType] || 0) + 1;
        data.totalDeviceCount = (data.totalDeviceCount || 0) + 1;
        saveAnalytics();
    }

    let listeningSecs = (prevSession && prevSession.listeningSeconds) || 0;

    if (!isPlaying) {
        if (activeSessions.has(sessionId)) {
            activeSessions.set(sessionId, {
                sessionId: sessionId,
                title: title,
                artist: artist,
                id: songId,
                image: image,
                isPlaying: false,
                lastSeen: now,
                listeningSeconds: listeningSecs,
                device: deviceType,
                user: userInfo
            });
        }
    } else {
        const isNewPlay = !prevSession || !prevSession.isPlaying || (prevSession.title !== title);

        // Calculate listening elapsed time (heartbeats typically every 10-30s)
        let elapsedDelta = 0;
        if (prevSession && prevSession.isPlaying) {
            const timeSinceLast = Math.min(60, Math.max(1, Math.round((now - prevSession.lastSeen) / 1000)));
            elapsedDelta = timeSinceLast;
            listeningSecs += timeSinceLast;
        } else {
            elapsedDelta = 10; // Initial start playback chunk
            listeningSecs += 10;
        }

        activeSessions.set(sessionId, {
            sessionId: sessionId,
            title: title || 'Lagu Sedang Diputar',
            artist: artist || 'MusifyStar',
            id: songId,
            image: image,
            isPlaying: true,
            lastSeen: now,
            listeningSeconds: listeningSecs,
            device: deviceType,
            user: userInfo
        });

        // 2. Average Duration Accumulator
        if (!data.duration) {
            data.duration = {
                totalListeningSeconds: 0,
                totalSessions: 0,
                distribution: { quick: 0, short: 0, medium: 0, long: 0, extended: 0 }
            };
        }

        data.duration.totalListeningSeconds = (data.duration.totalListeningSeconds || 0) + elapsedDelta;

        // Register session in duration stats once it passes 15 seconds
        if (listeningSecs >= 15 && !recordedSessionDurations.has(sessionId)) {
            recordedSessionDurations.set(sessionId, 'quick');
            data.duration.totalSessions = (data.duration.totalSessions || 0) + 1;
            data.duration.distribution.quick = (data.duration.distribution.quick || 0) + 1;
        } else if (recordedSessionDurations.has(sessionId)) {
            // Upgrade duration distribution bracket dynamically as user keeps listening
            const currentBracket = recordedSessionDurations.get(sessionId);
            const minutes = listeningSecs / 60;
            let newBracket = 'quick';
            if (minutes >= 60) newBracket = 'extended';
            else if (minutes >= 30) newBracket = 'long';
            else if (minutes >= 15) newBracket = 'medium';
            else if (minutes >= 5) newBracket = 'short';

            if (newBracket !== currentBracket) {
                if (data.duration.distribution[currentBracket] > 0) {
                    data.duration.distribution[currentBracket] -= 1;
                }
                data.duration.distribution[newBracket] = (data.duration.distribution[newBracket] || 0) + 1;
                recordedSessionDurations.set(sessionId, newBracket);
            }
        }

        // 3. Hourly Heatmap & Top 50 Song Plays Recording
        if (isNewPlay && title) {
            // Indonesia / WIB timezone (UTC+7)
            const wibHour = new Date(now + 7 * 60 * 60 * 1000).getUTCHours();
            if (!data.hourly) data.hourly = {};
            data.hourly[wibHour] = (data.hourly[wibHour] || 0) + 1;
            data.totalPlays = (data.totalPlays || 0) + 1;

            // Record song play for Top 50 Most Played calculation
            if (!Array.isArray(data.songPlays)) data.songPlays = [];
            data.songPlays.push({
                id: songId,
                title: title,
                artist: artist || 'MusifyStar',
                image: image || '/logo.png',
                duration: duration,
                album: album,
                playedAt: now
            });

            // Prune play logs older than 35 days or when exceeding 10,000 items
            const cutoff = now - 35 * 24 * 60 * 60 * 1000;
            if (data.songPlays.length > 5000) {
                data.songPlays = data.songPlays.filter(p => p.playedAt >= cutoff);
            }
        }

        saveAnalytics();
    }

    // Clean up sessions older than 90 seconds
    for (const [sId, session] of activeSessions.entries()) {
        if (now - session.lastSeen > 90 * 1000) {
            activeSessions.delete(sId);
        }
    }
}

// Calculate Top 50 Most Played Songs for specific time window
function calculateTopPlayedSongs(plays, windowMs, limit = 50) {
    if (!Array.isArray(plays)) return { totalPlays: 0, songs: [] };

    const now = Date.now();
    const threshold = windowMs > 0 ? now - windowMs : 0;

    const countMap = new Map();
    let totalPlaysInWindow = 0;

    for (let i = plays.length - 1; i >= 0; i--) {
        const item = plays[i];
        if (!item || !item.title) continue;
        if (threshold > 0 && item.playedAt < threshold) continue;

        totalPlaysInWindow++;
        const key = (item.title + '___' + (item.artist || '')).toLowerCase();
        if (countMap.has(key)) {
            const entry = countMap.get(key);
            entry.count++;
            if (item.playedAt > entry.lastPlayed) {
                entry.lastPlayed = item.playedAt;
            }
            if (item.id && !entry.id) entry.id = item.id;
            if (item.image && (!entry.image || entry.image === '/logo.png')) entry.image = item.image;
        } else {
            countMap.set(key, {
                id: item.id || '',
                title: item.title,
                artist: item.artist || 'MusifyStar',
                image: item.image || '/logo.png',
                duration: item.duration || '',
                album: item.album || '',
                count: 1,
                lastPlayed: item.playedAt
            });
        }
    }

    const sorted = Array.from(countMap.values())
        .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return b.lastPlayed - a.lastPlayed;
        })
        .slice(0, limit);

    const formattedSongs = sorted.map((song, idx) => ({
        rank: idx + 1,
        id: song.id,
        title: song.title,
        artist: song.artist,
        image: song.image,
        duration: song.duration,
        album: song.album,
        count: song.count,
        percentage: totalPlaysInWindow > 0 ? Math.round((song.count / totalPlaysInWindow) * 100) : 0,
        lastPlayed: song.lastPlayed
    }));

    return {
        totalPlays: totalPlaysInWindow,
        songs: formattedSongs
    };
}

module.exports = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const method = req.method.toUpperCase();

    // 1. POST: Heartbeat, search event, or Admin reset actions
    if (method === 'POST') {
        const body = req.body || {};
        const type = body.type || body.action || 'heartbeat';

        // Admin action to clear analytics
        if (['clear_searches', 'clear_heatmap', 'clear_listeners', 'clear_sessions', 'clear_duration', 'clear_devices', 'clear_top_played', 'reset_analytics'].includes(type)) {
            const token = req.headers['x-admin-token'] || req.query.token;
            if (!adminAuth.isValidToken(token)) {
                return res.status(401).json({ status: false, message: 'Akses ditolak Membutuhkan token admin' });
            }
            const data = loadAnalytics();
            if (type === 'clear_searches') {
                data.searches = {};
                data.totalSearches = 0;
            } else if (type === 'clear_heatmap') {
                const empty = getInitialAnalytics();
                data.hourly = empty.hourly;
                data.totalPlays = 0;
            } else if (type === 'clear_listeners' || type === 'clear_sessions') {
                activeSessions.clear();
                return res.json({ status: true, message: 'Sesi pendengar aktif berhasil direset' });
            } else if (type === 'clear_duration') {
                data.duration = {
                    totalListeningSeconds: 0,
                    totalSessions: 0,
                    distribution: { quick: 0, short: 0, medium: 0, long: 0, extended: 0 }
                };
                recordedSessionDurations.clear();
            } else if (type === 'clear_devices') {
                data.devices = { android_apk: 0, pwa_chrome: 0, safari_ios: 0, desktop_web: 0 };
                data.totalDeviceCount = 0;
                recordedSessionDevices.clear();
            } else if (type === 'clear_top_played') {
                data.songPlays = [];
            } else if (type === 'reset_analytics') {
                const empty = getInitialAnalytics();
                data.hourly = empty.hourly;
                data.searches = empty.searches;
                data.songPlays = [];
                data.totalPlays = 0;
                data.totalSearches = 0;
                data.duration = empty.duration;
                data.devices = empty.devices;
                data.totalDeviceCount = 0;
                activeSessions.clear();
                recordedSessionDevices.clear();
                recordedSessionDurations.clear();
            }
            saveAnalytics();
            return res.json({ status: true, message: 'Data analitik berhasil direset' });
        }

        if (type === 'search' && body.query) {
            recordSearch(body.query);
            return res.json({ status: true });
        }

        if (type === 'heartbeat') {
            recordHeartbeat(body, req.headers['user-agent']);
            return res.json({ status: true });
        }

        return res.status(400).json({ status: false, message: 'Tipe analitik tidak dikenal' });
    }

    // Public / Client endpoint to fetch Top 50 Most Played Songs (e.g. for charts/trending)
    if (method === 'GET' && (req.query.type === 'top_played' || req.query.public === 'top_played')) {
        const data = loadAnalytics();
        const tf = req.query.timeframe || '24h';
        let windowMs = 24 * 60 * 60 * 1000;
        if (tf === '7d') windowMs = 7 * 24 * 60 * 60 * 1000;
        if (tf === '30d') windowMs = 30 * 24 * 60 * 60 * 1000;
        if (tf === 'all') windowMs = 0;

        const result = calculateTopPlayedSongs(data.songPlays || [], windowMs, 50);
        return res.json({
            status: true,
            timeframe: tf,
            totalPlaysInPeriod: result.totalPlays,
            songs: result.songs
        });
    }

    // Admin authorization check for full GET analytics dashboard data
    const token = req.headers['x-admin-token'] || req.query.token;
    if (!adminAuth.isValidToken(token)) {
        return res.status(401).json({ status: false, message: 'Akses ditolak: Membutuhkan token admin' });
    }

    // 2. GET: Analytics Summary for Admin Dashboard
    if (method === 'GET') {
        const data = loadAnalytics();
        const now = Date.now();

        // Calculate real-time active listeners (active within 90 seconds and currently playing)
        const activeList = [];
        for (const session of activeSessions.values()) {
            if (session.isPlaying && now - session.lastSeen <= 90 * 1000) {
                activeList.push(session);
            }
        }

        const realActiveCount = activeList.length;

        // 1. Prepare Top Search Queries
        const searchEntries = Object.values(data.searches || {});
        const totalSearchQueriesCount = searchEntries.reduce((acc, curr) => acc + curr.count, 0);
        const searchList = searchEntries
            .sort((a, b) => b.count - a.count)
            .slice(0, 25);

        const formattedSearches = searchList.map((item, idx) => ({
            rank: idx + 1,
            query: item.query,
            count: item.count,
            percentage: totalSearchQueriesCount > 0 ? Math.round((item.count / totalSearchQueriesCount) * 100) : 0,
            lastSearched: item.lastSearched
        }));

        // 2. Prepare 24-Hour Heatmap
        const hourlyList = [];
        let peakHour = null;
        let peakCount = 0;
        let totalDailyPlays = 0;

        const segments = { diniHari: 0, pagi: 0, siangSore: 0, malam: 0 };

        for (let h = 0; h < 24; h++) {
            const count = (data.hourly && data.hourly[h]) || 0;
            totalDailyPlays += count;
            if (count > peakCount) {
                peakCount = count;
                peakHour = h;
            }

            if (h >= 0 && h <= 4) segments.diniHari += count;
            else if (h >= 5 && h <= 11) segments.pagi += count;
            else if (h >= 12 && h <= 17) segments.siangSore += count;
            else if (h >= 18 && h <= 23) segments.malam += count;

            const hourLabel = String(h).padStart(2, '0') + ':00';
            hourlyList.push({ hour: h, label: hourLabel, count: count });
        }

        const maxHourly = peakCount > 0 ? peakCount : 1;
        const enrichedHourly = hourlyList.map(h => ({
            ...h,
            pct: peakCount > 0 ? Math.round((h.count / maxHourly) * 100) : 0,
            isPeak: peakCount > 0 && h.hour === peakHour
        }));

        let peakSegmentName = '-';
        if (totalDailyPlays > 0) {
            let maxSegVal = segments.malam;
            peakSegmentName = 'Malam 18:00 - 23:59';
            if (segments.siangSore > maxSegVal) {
                maxSegVal = segments.siangSore;
                peakSegmentName = 'Siang & Sore 12:00 - 17:59';
            }
            if (segments.pagi > maxSegVal) {
                maxSegVal = segments.pagi;
                peakSegmentName = 'Pagi Hari 05:00 - 11:59';
            }
            if (segments.diniHari > maxSegVal) {
                peakSegmentName = 'Malam Hari (00:00 - 04:59)';
            }
        }

        // 3. Prepare Average Listening Duration Stats
        const dur = data.duration || { totalListeningSeconds: 0, totalSessions: 0, distribution: {} };
        const totalSecs = dur.totalListeningSeconds || 0;
        const totalSessions = dur.totalSessions || (dur.totalListeningSeconds > 0 ? 1 : 0);
        const avgSeconds = totalSessions > 0 ? Math.round(totalSecs / totalSessions) : 0;
        const avgMinutes = (avgSeconds / 60).toFixed(1);
        const totalHours = (totalSecs / 3600).toFixed(1);

        const durationDistribution = dur.distribution || { quick: 0, short: 0, medium: 0, long: 0, extended: 0 };
        const totalDistCount = Object.values(durationDistribution).reduce((a, b) => a + b, 0) || 1;

        const durationStats = {
            totalSeconds: totalSecs,
            totalMinutes: Math.round(totalSecs / 60),
            totalHours: totalHours,
            totalSessions: totalSessions,
            avgSeconds: avgSeconds,
            avgMinutesFormatted: totalSessions > 0 ? `${avgMinutes} Menit` : '0 Menit',
            distribution: [
                { label: '5 MENIT', count: durationDistribution.quick || 0, pct: Math.round(((durationDistribution.quick || 0) / totalDistCount) * 100), desc: '5 menit Kilat' },
                { label: '5-15 MENIT', count: durationDistribution.short || 0, pct: Math.round(((durationDistribution.short || 0) / totalDistCount) * 100), desc: '5-15 Menit Singkat' },
                { label: '15-30 MENIT', count: durationDistribution.medium || 0, pct: Math.round(((durationDistribution.medium || 0) / totalDistCount) * 100), desc: '15-30 Menit Standar' },
                { label: '30-60 MENIT', count: durationDistribution.long || 0, pct: Math.round(((durationDistribution.long || 0) / totalDistCount) * 100), desc: '30-60 Menit Fokus' },
                { label: '1jam MENIT', count: durationDistribution.extended || 0, pct: Math.round(((durationDistribution.extended || 0) / totalDistCount) * 100), desc: '1 jam Maraton' }
            ]
        };

        // 4. Prepare Device & Browser Breakdown
        const dev = data.devices || { android_apk: 0, pwa_chrome: 0, safari_ios: 0, desktop_web: 0 };
        const totalDev = data.totalDeviceCount || (dev.android_apk + dev.pwa_chrome + dev.safari_ios + dev.desktop_web) || 0;
        const calcDevPct = (val) => totalDev > 0 ? Math.round((val / totalDev) * 100) : 0;

        const deviceBreakdown = {
            totalDevices: totalDev,
            items: [
                { key: 'android_apk', label: 'Android Aplikasi', count: dev.android_apk || 0, pct: calcDevPct(dev.android_apk || 0), icon: 'smartphone', color: 'emerald', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                { key: 'pwa_chrome', label: 'install Aplikasi', count: dev.pwa_chrome || 0, pct: calcDevPct(dev.pwa_chrome || 0), icon: 'globe', color: 'amber', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                { key: 'safari_ios', label: 'Safari iOS', count: dev.safari_ios || 0, pct: calcDevPct(dev.safari_ios || 0), icon: 'apple', color: 'indigo', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
                { key: 'desktop_web', label: 'Desktop Web', count: dev.desktop_web || 0, pct: calcDevPct(dev.desktop_web || 0), icon: 'monitor', color: 'purple', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
            ]
        };

        // 5. Top 50 Most Played Songs (24 Hours, 7 Days, 30 Days)
        const plays = data.songPlays || [];
        const top24h = calculateTopPlayedSongs(plays, 24 * 60 * 60 * 1000, 50);
        const top7d = calculateTopPlayedSongs(plays, 7 * 24 * 60 * 60 * 1000, 50);
        const top30d = calculateTopPlayedSongs(plays, 30 * 24 * 60 * 60 * 1000, 50);

        return res.json({
            status: true,
            activeListeners: {
                count: realActiveCount,
                sessions: activeList.slice(0, 10)
            },
            listeningDuration: durationStats,
            deviceBreakdown: deviceBreakdown,
            topPlayed: {
                '24h': top24h,
                '7d': top7d,
                '30d': top30d,
                totalRecordedPlays: plays.length
            },
            searchAnalytics: {
                totalSearches: data.totalSearches || 0,
                topQueries: formattedSearches
            },
            listeningHeatmap: {
                totalPlays: totalDailyPlays,
                peakHour: peakHour !== null ? String(peakHour).padStart(2, '0') + ':00' : '-',
                peakCount: peakCount,
                peakSegment: peakSegmentName,
                segments: segments,
                hourly: enrichedHourly
            }
        });
    }

    return res.status(405).json({ status: false, message: 'Metode tidak didukung' });
};

module.exports.recordSearch = recordSearch;
module.exports.recordHeartbeat = recordHeartbeat;
