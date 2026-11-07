//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                             GAAJU-XMD BOT
//                                                                  V : 1.0.0
//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//

const log = (...args) => process.stderr.write(
    args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') + '\n'
);

const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgBlack: '\x1b[40m',
    bold: '\x1b[1m',
};

require('dotenv').config();

const fs = require('fs');
const path = require('path');

function getDeploymentPlatform() {
    if (process.env.RENDER) return 'Render';
    if (process.env.CODESPACE_NAME) return 'Codespaces';
    if (process.env.PANEL_APP) return 'Panel';
    if (process.env.REPL_SLUG) return 'Replit';
    if (process.env.KOYEB_APP) return 'Koyeb';
    if (process.env.FLY_APP_NAME) return 'Fly.io';
    if (process.env.GLITCH_PROJECT_ID) return 'Glitch';
    if (process.env.VERCEL) return 'Vercel';
    if (process.env.HEROKU_APP_NAME) return 'Heroku';
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    return 'Local Machine';
}

global.File = class File {};

const { Boom } = require('@hapi/boom');
const { handleMessages, handleGroupParticipantUpdate } = require('./main');

const { getCurrentStyle } = require('./commands/menustyle');
const { getCurrentFont, applyFont } = require('./commands/menufont');

try {
    const autorecord = require('./commands/autorecord');
    autorecord.stopAllInfiniteRecordings();
} catch (e) {}

try {
    const autotyping = require('./commands/autotyping');
    autotyping.stopAllInfiniteTyping();
} catch (e) {}

const {
    handleStatusUpdate,
    handleBulkStatusUpdate
} = require('./commands/autostatus');

const { storeMessage } = require('./commands/antidelete');
const PhoneNumber = require('awesome-phonenumber');
const { smsg } = require('./lib/myfunc');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');

const NodeCache = require('node-cache');
const pino = require('pino');
const readline = require('readline');
const { rmSync } = require('fs');

let reconnectAttempts = 0;
let startupTasksDone = false;

const MAX_RECONNECT_ATTEMPTS = 5;

const store = require('./lib/lightweight_store');
store.readFromFile();

const settings = require('./settings');

setInterval(() => {
    try {
        store.writeToFile();
    } catch (e) {}
}, settings.storeWriteInterval || 10000);

function readStatusConfig() {
    try {
        const p = path.join(__dirname, 'data', 'autostatus.json');

        if (fs.existsSync(p)) {
            const config = JSON.parse(fs.readFileSync(p, 'utf8'));

            return {
                enabled: config.enabled === true,
                likeOn: config.likeOn === true,
                selfOn: config.selfOn === true
            };
        }
    } catch (e) {}

    return {
        enabled: false,
        likeOn: false,
        selfOn: false
    };
}

function getBotMode() {
    try {
        const p = path.join(__dirname, 'data', 'messageCount.json');

        if (fs.existsSync(p)) {
            const d = JSON.parse(fs.readFileSync(p, 'utf8'));

            if (typeof d.isPublic === 'boolean') {
                return d.isPublic ? 'Public' : 'Private';
            }
        }

        return 'Public';
    } catch (e) {
        return 'Public';
    }
}

setInterval(() => {
    const memMB = process.memoryUsage().rss / 1024 / 1024;

    if (memMB > 500) {
        if (global.gc) global.gc();
    }

    if (memMB > 700) process.exit(1);
}, 5 * 60 * 1000);

setInterval(() => {
    if (global.gc) global.gc();
}, 60000);

let phoneNumber = '2348038915922';

let owner = JSON.parse(fs.readFileSync('./data/owner.json'));

global.botname = 'GAAJU-XMD';
global.themeemoji = '🤖';

const pairingCode = !!phoneNumber || process.argv.includes('--pairing-code');
const useMobile = process.argv.includes('--mobile');

const rl = process.stdin.isTTY
    ? readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    : null;

const question = (text) => rl
    ? new Promise(resolve => rl.question(text, resolve))
    : Promise.resolve(settings.ownerNumber || phoneNumber);

function getCommandCount() {
    try {
        const helpPath = path.join(__dirname, 'commands', 'help.js');
        const content = fs.readFileSync(helpPath, 'utf8');

        const match = content.match(/const allCommandsRaw = \{([\s\S]*?)\};/);

        if (!match) return 200;

        const commands = match[1].match(/\.\w+/g);

        return commands ? new Set(commands).size : 200;
    } catch (e) {
        return 200;
    }
}

// ---- SEND MENU AUDIO ----

async function sendMenuAudio(sock, chatId, message) {
    try {
        const audioPath = path.join(__dirname, 'assets', 'menu_audio.mp3');

        if (fs.existsSync(audioPath)) {
            const opts = message ? { quoted: message } : {};

            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false
            }, opts);

            return true;
        }

        return false;
    } catch (e) {
        log(c.yellow + '⚠️ Menu audio send failed: ' + e.message + c.reset);
        return false;
    }
}

// ==========================================
// AUTO JOIN GROUP
// ==========================================

async function autoJoinGroup(sock, groupLink) {
    try {
        let inviteCode = groupLink.trim();

        if (inviteCode.includes('chat.whatsapp.com/')) {
            inviteCode = inviteCode.split('chat.whatsapp.com/')[1];
        }

        inviteCode = inviteCode.split('?')[0].replace(/\/$/, '');

        if (!inviteCode) {
            throw new Error('Invalid group invite link');
        }

        log(c.cyan + '🔄 Checking support group invite...' + c.reset);

        const groupInfo = await sock.groupGetInviteInfo(inviteCode);

        if (!groupInfo || !groupInfo.id) {
            throw new Error('Could not retrieve group information');
        }

        const groups = await sock.groupFetchAllParticipating();

        if (groups[groupInfo.id]) {
            log(c.green + '✅ Bot is already in the support group!' + c.reset);

            return {
                success: true,
                method: 'already_in_group'
            };
        }

        log(c.cyan + '🔄 Attempting to join support group...' + c.reset);

        await sock.groupAcceptInvite(inviteCode);

        log(c.green + '✅ Successfully joined support group!' + c.reset);

        return {
            success: true,
            method: 'groupAcceptInvite'
        };

    } catch (e) {
        log(c.red + '❌ Group join failed: ' + e.message + c.reset);

        return {
            success: false,
            error: e.message
        };
    }
}

// ==========================================
// AUTO FOLLOW CHANNEL
// ==========================================

async function autoFollowChannel(sock, channelLink) {
    try {
        let inviteCode = channelLink.trim();

        if (inviteCode.includes('/channel/')) {
            inviteCode = inviteCode.split('/channel/')[1];
        }

        inviteCode = inviteCode.split('?')[0].replace(/\/$/, '');

        if (!inviteCode) {
            throw new Error('Invalid WhatsApp channel invite link');
        }

        log(c.cyan + '🔄 Fetching WhatsApp channel information...' + c.reset);

        const metadata = await sock.newsletterMetadata(
            'invite',
            inviteCode
        );

        if (!metadata || !metadata.id) {
            throw new Error('Unable to retrieve channel information');
        }

        log(c.cyan + '🔄 Following GAAJU-XMD channel...' + c.reset);

        await sock.newsletterFollow(metadata.id);

        log(c.green + '✅ Successfully followed GAAJU-XMD channel!' + c.reset);

        return {
            success: true,
            method: 'newsletterFollow'
        };

    } catch (e) {
        const error = e.message || String(e);

        if (/already.follow|already.subscribed/i.test(error)) {
            log(c.cyan + 'ℹ️ Bot is already following the channel.' + c.reset);

            return {
                success: true,
                method: 'already_following'
            };
        }

        log(c.red + '❌ Channel follow failed: ' + error + c.reset);

        return {
            success: false,
            error
        };
    }
}

// ---- BUILD CONNECTION MESSAGE ----

function buildConnectionMessage(styleId, sections) {
    let fullMessage = '';

    for (const section of sections) {
        if (styleId === 1) {
            fullMessage += `╭──◆「 *${section.title}* 」◆\n├\n`;

            for (const line of section.lines) {
                fullMessage += `├◇ ${line}\n`;
            }

            fullMessage += `├\n╰─┬─★─☆─♪♪─◆\n\n`;
        }
        else if (styleId === 2) {
            fullMessage += `◈──────────────────────◈\n           *${section.title}*\n◈──────────────────────◈\n\n`;

            for (const line of section.lines) {
                fullMessage += `▤ ${line}\n`;
            }

            fullMessage += `◈──────────────────────◈\n\n`;
        }
        else if (styleId === 3) {
            fullMessage += `╔══════════════════╗\n║ *${section.title}*\n║ ══════════════════\n`;

            for (const line of section.lines) {
                fullMessage += `║ ${line}\n`;
            }

            fullMessage += `╚══════════════════╝\n\n`;
        }
        else if (styleId === 4) {
            fullMessage += `╭──〔 *${section.title}* 〕─┈𓊉꧂\n║     ╭──────────────┈❀\n`;

            for (const line of section.lines) {
                fullMessage += `║☠︎︎║ ${line}\n`;
            }

            fullMessage += `║     ╰──────────────┈❀\n╰───────────────────┈𓊉꧂\n\n`;
        }
        else if (styleId === 5) {
            fullMessage += `  🌀◈── *${section.title}* ──◈❃🌸❃\n\n╭──────────●●➤\n`;

            for (const line of section.lines) {
                fullMessage += `┊ ${line}\n`;
            }

            fullMessage += `╰──────·••─────•────●○\n\n`;
        }
        else if (styleId === 6) {
            fullMessage += `╭──〈 *${section.title}* 〉──💕⃝🕊️\n`;

            for (const line of section.lines) {
                fullMessage += `⚚  ${line}\n`;
            }

            fullMessage += `╰────────────────✌︎㋡\n\n`;
        }
        else if (styleId === 7) {
            fullMessage += `╔══════════════════❥❥❥\n✧  *${section.title}*\n╚══════════════════❥❥❥\n`;

            for (const line of section.lines) {
                fullMessage += `✧  ${line}\n`;
            }

            fullMessage += '\n';
        }
        else {
            fullMessage += `◈──────────────────────◈\n           *${section.title}*\n◈──────────────────────◈\n\n`;

            for (const line of section.lines) {
                fullMessage += `▤ ${line}\n`;
            }

            fullMessage += `◈──────────────────────◈\n\n`;
        }
    }

    if (styleId === 1) {
        fullMessage += `╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`;
    }
    else if (styleId === 2 || !styleId) {
        fullMessage += `◈──────────────────────◈\n           *GAAJU-XMD*\n◈──────────────────────◈`;
    }
    else if (styleId === 3) {
        fullMessage += `╔══════════════════╗\n║ *GAAJU-XMD*\n╚══════════════════╝`;
    }
    else if (styleId === 4) {
        fullMessage += `╭─〔 *GAAJU-XMD* 〕──┈𓊉꧂\n╰─────────────────┈𓊉꧂`;
    }
    else if (styleId === 5) {
        fullMessage += `╭──────────●●➤\n┊ *GAAJU-XMD*\n╰──────·••─────•────●○`;
    }
    else if (styleId === 6) {
        fullMessage += `╭──〈 *GAAJU-XMD* 〉──💕⃝🕊️\n╰──────────────✌︎㋡`;
    }
    else if (styleId === 7) {
        fullMessage += `╔══════════════════❥❥❥\n✧  *GAAJU-XMD*\n╚══════════════════❥❥❥`;
    }
    else {
        fullMessage += `◈──────────────────────◈\n           *GAAJU-XMD*\n◈──────────────────────◈`;
    }

    try {
        const fontId = getCurrentFont();

        fullMessage = fullMessage
            .split(/(https?:\/\/\S+)/g)
            .map((part, i) => (
                i % 2 === 1 ? part : applyFont(part, fontId)
            ))
            .join('');

    } catch (e) {
        log(c.yellow + '⚠️ Font apply failed for connection message: ' + e.message + c.reset);
    }

    return fullMessage;
}

// ==========================================
// START BOT
// ==========================================

async function startXeonBotInc() {
    try {
        reconnectAttempts = 0;

        // ==========================================
        // GAAJU-MD SESSION RESTORATION
        // ==========================================

        const sessionId = process.env.SESSION_ID || global.sessionid || '';

        if (!fs.existsSync('./session/creds.json') && sessionId.trim()) {
            try {
                let sessionData;
                const sessionString = sessionId.trim();

                if (sessionString.startsWith('GAAJU-MD:')) {
                    const base64Part = sessionString
                        .substring(9)
                        .trim()
                        .replace(/^~+/, '');

                    const decoded = Buffer
                        .from(base64Part, 'base64')
                        .toString('utf-8');

                    sessionData = JSON.parse(decoded);

                } else {
                    try {
                        sessionData = JSON.parse(sessionString);
                    } catch {
                        const decoded = Buffer
                            .from(sessionString, 'base64')
                            .toString('utf-8');

                        sessionData = JSON.parse(decoded);
                    }
                }

                if (!sessionData || typeof sessionData !== 'object') {
                    throw new Error('Invalid session data');
                }

                fs.mkdirSync('./session', {
                    recursive: true
                });

                fs.writeFileSync(
                    './session/creds.json',
                    JSON.stringify(sessionData, null, 2)
                );

                log(c.green + '✅ GAAJU-MD Session restored successfully!' + c.reset);

            } catch (err) {
                log(c.red + '❌ Session restoration failed: ' + err.message + c.reset);
                throw err;
            }
        }

        // Load Baileys authentication
        const { version } = await fetchLatestBaileysVersion();

        const { state, saveCreds } = await useMultiFileAuthState('./session');

        const msgRetryCounterCache = new NodeCache();

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,

            browser: ['Ubuntu', 'Chrome', '120.0.6099.109'],

            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    pino({ level: 'fatal' }).child({ level: 'fatal' })
                )
            },

            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,

            getMessage: async (key) => {
                const j = jidNormalizedUser(key.remoteJid);
                const m = await store.loadMessage(j, key.id);

                return m?.message || '';
            },

            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000
        });

        XeonBotInc.ev.on('creds.update', saveCreds);

        store.bind(XeonBotInc.ev);

        // ---- MESSAGES ----

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0];

                if (!mek.message) return;

                mek.message = (
                    Object.keys(mek.message)[0] === 'ephemeralMessage'
                )
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

                if (
                    mek.key &&
                    mek.key.remoteJid === 'status@broadcast'
                ) {
                    if (mek.key.fromMe) {
                        const sc = readStatusConfig();

                        if (sc.enabled && sc.selfOn) {
                            handleStatusUpdate(XeonBotInc, chatUpdate).catch(() => {});
                        }

                        return;
                    }

                    storeMessage(XeonBotInc, mek);

                    const sc = readStatusConfig();

                    if (sc.enabled === true) {
                        handleStatusUpdate(XeonBotInc, chatUpdate).catch(() => {});
                    }
                }

                if (
                    !XeonBotInc.public &&
                    !mek.key.fromMe &&
                    chatUpdate.type === 'notify'
                ) {
                    if (!(mek.key?.remoteJid?.endsWith('@g.us'))) return;
                }

                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) {
                    return;
                }

                if (XeonBotInc?.msgRetryCounterCache) {
                    XeonBotInc.msgRetryCounterCache.clear();
                }

                try {
                    await handleMessages(XeonBotInc, chatUpdate, true);
                } catch (err) {
                    if (
                        mek.key?.remoteJid &&
                        mek.key.remoteJid !== 'status@broadcast'
                    ) {
                        await XeonBotInc.sendMessage(
                            mek.key.remoteJid,
                            { text: 'Error' }
                        ).catch(() => {});
                    }
                }

            } catch (err) {}
        });

        // ---- JID / CONTACT HELPERS ----

        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid;

            if (/:\d+@/gi.test(jid)) {
                const d = jidDecode(jid) || {};

                return (
                    d.user &&
                    d.server &&
                    d.user + '@' + d.server
                ) || jid;
            }

            return jid;
        };

        XeonBotInc.ev.on('contacts.update', update => {
            for (const contact of update) {
                const id = XeonBotInc.decodeJid(contact.id);

                if (store?.contacts) {
                    store.contacts[id] = {
                        id,
                        name: contact.notify
                    };
                }
            }
        });

        XeonBotInc.getName = (jid, withoutContact = false) => {
            const id = XeonBotInc.decodeJid(jid);

            withoutContact = XeonBotInc.withoutContact || withoutContact;

            let v;

            if (id.endsWith('@g.us')) {
                return new Promise(async (resolve) => {
                    v = store.contacts[id] || {};

                    if (!(v.name || v.subject)) {
                        v = XeonBotInc.groupMetadata(id) || {};
                    }

                    resolve(
                        v.name ||
                        v.subject ||
                        PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international')
                    );
                });
            }
            else {
                v = id === '0@s.whatsapp.net'
                    ? { id, name: 'WhatsApp' }
                    : id === XeonBotInc.decodeJid(XeonBotInc.user.id)
                        ? XeonBotInc.user
                        : (store.contacts[id] || {});
            }

            return (
                (withoutContact ? '' : v.name) ||
                v.subject ||
                v.verifiedName ||
                PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            );
        };

        XeonBotInc.public = true;

        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store);

        // ==========================================
        // PAIRING CODE
        // ==========================================

        if (pairingCode && !state.creds.registered) {
            if (useMobile) {
                throw new Error('Cannot use pairing code with mobile api');
            }

            let pn = global.phoneNumber || await question(
                c.bgBlack + c.bgGreen +
                'WhatsApp number (2348155763709): ' +
                c.reset
            );

            pn = pn.replace(/[^0-9]/g, '');

            if (!PhoneNumber('+' + pn).isValid()) {
                log(c.red + 'Invalid number.' + c.reset);
                process.exit(1);
            }

            setTimeout(async () => {
                try {
                    let code = await XeonBotInc.requestPairingCode(pn);

                    code = code?.match(/.{1,4}/g)?.join('-') || code;

                    log(c.bgGreen + c.black + 'Code: ' + code + c.reset);

                } catch (e) {
                    log(c.red + 'Pairing code error: ' + e.message + c.reset);
                }
            }, 3000);
        }

        // ==========================================
        // CONNECTION UPDATE
        // ==========================================

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s;

            if (qr) {
                log(c.cyan + 'QR Code generated.' + c.reset);
            }

            if (connection === 'connecting') {
                log(c.cyan + 'Connecting...' + c.reset);
            }

            if (connection === 'open') {
                log(
                    c.cyan +
                    'Connected => ' +
                    JSON.stringify(XeonBotInc.user, null, 2) +
                    c.reset
                );

                reconnectAttempts = 0;

                if (startupTasksDone) {
                    log(c.green + 'Reconnected (startup tasks skipped)' + c.reset);
                    return;
                }

                startupTasksDone = true;

                const BOT_ID = settings.ownerNumber;

                setInterval(async () => {
                    try {
                        await fetch(
                            'https://gemini-proxy-5t1s.onrender.com/v1/heartbeat',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    botId: BOT_ID,
                                    userId: settings.ownerNumber,
                                    platform: getDeploymentPlatform(),
                                    botOwner: settings.botOwner || 'Unknown',
                                    timezone: settings.timezone || 'Africa/Lagos',
                                    botName: settings.botName || 'GAAJU-XMD'
                                })
                            }
                        );
                    } catch (e) {}
                }, 1000);

                // ---- FETCH GROUPS ----

                try {
                    const groups = await XeonBotInc.groupFetchAllParticipating();

                    for (const g of Object.values(groups)) {
                        if (store.chats) {
                            store.chats[g.id] = {
                                id: g.id,
                                ...g
                            };
                        }
                    }
                } catch (e) {}

                // ---- SESSION BACKUP ----

                setInterval(() => {
                    try {
                        const bd = './session_backup';

                        if (!fs.existsSync(bd)) {
                            fs.mkdirSync(bd);
                        }

                        fs.cpSync('./session', bd, {
                            recursive: true
                        });

                    } catch (e) {}
                }, 60 * 60 * 1000);

                // ==========================================
                // AUTO JOIN YOUR SUPPORT GROUP
                // ==========================================

                try {
                    const groupLink = 'https://chat.whatsapp.com/DXksVb4su2cHKxrmKktHQd';

                    const joinResult = await autoJoinGroup(
                        XeonBotInc,
                        groupLink
                    );

                    if (joinResult.success) {
                        log(c.green + `✅ Auto-join completed! (${joinResult.method})` + c.reset);
                    } else {
                        log(c.yellow + `⚠️ Auto-join failed: ${joinResult.error}` + c.reset);
                    }

                } catch (e) {
                    log(c.yellow + '⚠️ Auto-join error: ' + e.message + c.reset);
                }

                // ==========================================
                // AUTO FOLLOW YOUR WHATSAPP CHANNEL
                // ==========================================

                try {
                    const channelLink = 'https://whatsapp.com/channel/0029VbCt4MzCHDyk95cErV0y';

                    const followResult = await autoFollowChannel(
                        XeonBotInc,
                        channelLink
                    );

                    if (followResult.success) {
                        log(c.green + `✅ Auto-follow completed! (${followResult.method})` + c.reset);
                    } else {
                        log(c.yellow + `⚠️ Auto-follow failed: ${followResult.error}` + c.reset);
                    }

                } catch (e) {
                    log(c.yellow + '⚠️ Auto-follow error: ' + e.message + c.reset);
                }

                // ---- SEND CONNECTION MESSAGE ----

                try {
                    const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';

                    const time = new Date().toLocaleString('en-US', {
                        timeZone: settings.timezone || 'Africa/Lagos',
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    const modeText = getBotMode();

                    const currentStyle = getCurrentStyle() || 2;
                    const currentFont = getCurrentFont() || 1;

                    // ---- DETECT MEDIA FILES ----

                    const imagePath = path.join(__dirname, 'assets', 'bot_image.jpg');
                    const gifPath = path.join(__dirname, 'assets', 'menu_video.mp4');
                    const audioPath = path.join(__dirname, 'assets', 'menu_audio.mp3');

                    const hasImage = fs.existsSync(imagePath);
                    const hasGif = fs.existsSync(gifPath);
                    const hasAudio = fs.existsSync(audioPath);

                    // ---- PICK MENU TYPE ----

                    let menuType = 'Text';

                    if (hasImage && hasGif) {
                        menuType = Math.random() < 0.5 ? 'Image' : 'GIF';
                    }
                    else if (hasImage) {
                        menuType = 'Image';
                    }
                    else if (hasGif) {
                        menuType = 'GIF';
                    }

                    let mediaDisplay;

                    if (menuType === 'GIF') {
                        mediaDisplay = hasAudio ? 'GIF & Audio' : 'GIF';
                    }
                    else if (menuType === 'Image') {
                        mediaDisplay = hasAudio ? 'Image & Audio' : 'Image';
                    }
                    else {
                        mediaDisplay = hasAudio ? 'Text & Audio' : 'Text';
                    }

                    const sections = [
                        {
                            title: 'BOT CONNECTED',
                            lines: [
                                `📅 Date: ${time.split(',')[0] || time}`,
                                `⌚ Time: ${time.split(', ')[1] || time}`,
                                `✅ Status: Online`,
                                `💻 Version: ${settings.version}`,
                                `👤 Owner: Chris Gaaju`,
                                `📞 Contact: +2348069675806`,
                                `🌐 Prefix: ${settings.prefix}`,
                                `🔒 Mode: ${modeText}`,
                                `🎨 Style: ${currentStyle}`,
                                `🖋️ Font: ${currentFont}`,
                                `🎬 Media: ${mediaDisplay}`,
                                `💡 Commands: ${getCommandCount()}+`
                            ]
                        },
                        {
                            title: 'QUICK START',
                            lines: [
                                `📂 .fullmenu    → All commands`,
                                `📞 .owner   → Contact owner`,
                                `⚙️ .settings → Bot settings`,
                                `📶 .ping    → Check speed`,
                                `🔄 .update  → Update bot`
                            ]
                        },
                        {
                            title: 'CONNECT',
                            lines: [
                                `💬 Support Group`,
                                `📺 YouTube Channel`,
                                `⭐ GitHub Repo`,
                                `🔔 Channel Updates`
                            ]
                        },
                        {
                            title: 'LINKS',
                            lines: [
                                `🔗 WhatsApp Channel:`,
                                `https://whatsapp.com/channel/0029VbCt4MzCHDyk95cErV0y`,
                                ``,
                                `💬 Support group:`,
                                `https://chat.whatsapp.com/DXksVb4su2cHKxrmKktHQd`,
                                ``,
                                `📺 YouTube: Xchristech`,
                                ``,
                                `⭐ GitHub:`,
                                `https://github.com/Xchristech2`
                            ]
                        },
                        {
                            title: 'COPYRIGHT',
                            lines: [
                                `© 2025-2026`,
                                `GAAJU-XMD`,
                                `All Rights Reserved.`
                            ]
                        }
                    ];

                    const fullMessage = buildConnectionMessage(
                        currentStyle,
                        sections
                    );

                    const channelCtx = {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363406588763460@newsletter',
                            newsletterName: '\u200E',
                            serverMessageId: -1
                        }
                    };

                    // ---- SEND MENU ----

                    if (menuType === 'GIF') {
                        await XeonBotInc.sendMessage(botNumber, {
                            video: fs.readFileSync(gifPath),
                            mimetype: 'video/mp4',
                            gifPlayback: true,
                            caption: fullMessage,
                            contextInfo: channelCtx
                        });
                    }
                    else if (menuType === 'Image') {
                        const img = fs.readFileSync(imagePath);

                        await XeonBotInc.sendMessage(botNumber, {
                            image: img,
                            caption: fullMessage,
                            contextInfo: channelCtx
                        });
                    }
                    else {
                        let img;

                        try {
                            const r = await fetch(
                                'https://raw.githubusercontent.com/Xchristech2/GAAJU-XMD/main/assets/bot_image.jpg'
                            );

                            if (r.ok) {
                                img = Buffer.from(await r.arrayBuffer());
                            }
                        } catch (e) {}

                        if (img) {
                            await XeonBotInc.sendMessage(botNumber, {
                                image: img,
                                caption: fullMessage,
                                contextInfo: channelCtx
                            });
                        }
                        else {
                            await XeonBotInc.sendMessage(botNumber, {
                                text: fullMessage,
                                contextInfo: channelCtx
                            });
                        }
                    }

                    // ---- SEND MENU AUDIO ----

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    await sendMenuAudio(XeonBotInc, botNumber, null);

                } catch (e) {
                    log(c.red + 'Error sending connection message: ' + e.message + c.reset);
                }

                log(c.green + 'Bot Connected!' + c.reset);
            }

            // ---- CONNECTION CLOSED ----

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;

                if (
                    statusCode === DisconnectReason.loggedOut ||
                    statusCode === 401
                ) {
                    try {
                        rmSync('./session', {
                            recursive: true,
                            force: true
                        });
                    } catch (e) {}

                    return;
                }

                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts++;

                    setTimeout(
                        startXeonBotInc,
                        Math.min(5000 * reconnectAttempts, 30000)
                    );
                }
                else {
                    process.exit(1);
                }
            }
        });

        // ---- ANTICALL ----

        const { handleAnticall } = require('./commands/anticall');

        XeonBotInc.ev.on('call', async (calls) => {
            await handleAnticall(XeonBotInc, calls);
        });

        // ---- GROUP PARTICIPANTS ----

        XeonBotInc.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(XeonBotInc, update);
        });

        // ---- BULK STATUS ----

        XeonBotInc.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.messages.length <= 1) return;

            const sm = m.messages.filter(msg =>
                msg.key &&
                msg.key.remoteJid === 'status@broadcast' &&
                !msg.key.fromMe &&
                msg.key.participant
            );

            if (sm.length > 0) {
                const sc = readStatusConfig();

                if (sc.enabled === true) {
                    handleBulkStatusUpdate(XeonBotInc, sm).catch(() => {});
                }
            }
        });

        return XeonBotInc;

    } catch (error) {
        log(c.red + 'Bot startup error: ' + error.message + c.reset);

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;

            await delay(5000 * reconnectAttempts);

            return startXeonBotInc();
        }

        log(c.red + 'Maximum reconnect attempts reached.' + c.reset);
        process.exit(1);
    }
}

// ==========================================
// START BOT
// ==========================================

log(c.cyan + 'Starting GAAJU-XMD Bot...' + c.reset);

startXeonBotInc().catch(error => {
    log(c.red + 'Fatal error: ' + error.message + c.reset);
    process.exit(1);
});

// ==========================================
// SHUTDOWN HANDLERS
// ==========================================

async function shutdown() {
    try {
        await fetch(
            'https://gemini-proxy-5t1s.onrender.com/v1/offline',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    botId: settings.ownerNumber
                })
            }
        );
    } catch (e) {}

    try {
        require('./commands/autorecord').stopAllInfiniteRecordings();
    } catch (e) {}

    try {
        require('./commands/autotyping').stopAllInfiniteTyping();
    } catch (e) {}

    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (err) => {
    log(c.red + 'Uncaught Exception: ' + err.message + c.reset);
});

process.on('unhandledRejection', (err) => {
    log(c.red + 'Unhandled Rejection: ' + err.message + c.reset);
});
