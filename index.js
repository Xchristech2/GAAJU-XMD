//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                                                                                                        //
//                                                             𝐖𝐀𝐋𝐋𝐘𝐉𝐀𝐘𝐓𝐄𝐂𝐇-𝐌𝐃 𝐁𝐎𝐓                                                                                                     //
//                                                                                                                                                                                        //
//                                                                  𝐕 : 1.0.0                                                                                                             //
//                                                                                                                                                                                        //
//                                                                                                                                                                                        //
//                ██╗    ██╗ █████╗ ██╗     ██╗  ██╗   ██╗   ██╗ █████╗ ██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗      ███╗   ███╗██████╗                                 //
//                ██║    ██║██╔══██╗██║     ██║  ╚██╗ ██╔╝   ██║██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝██╔════╝██║  ██║      ████╗ ████║██╔══██╗                              //
//                ██║ █╗ ██║███████║██║     ██║   ╚████╔╝    ██║███████║ ╚████╔╝    ██║   █████╗  ██║     ███████║█████╗██╔████╔██║██║  ██║                               //
//                ██║███╗██║██╔══██║██║     ██║    ╚██╔╝██   ██║██╔══██║  ╚██╔╝     ██║   ██╔══╝  ██║     ██╔══██║╚════╝██║╚██╔╝██║██║  ██║                               //
//                ╚███╔███╔╝██║  ██║███████╗███████╗██║ ╚█████╔╝██║  ██║   ██║      ██║   ███████╗╚██████╗██║  ██║      ██║ ╚═╝ ██║██████╔╝                              //
//                 ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝      ╚═╝     ╚═╝╚═════╝                                 //
//                                                                                                                                                                                        //
//                                                                 𝐂𝐎𝐏𝐘𝐑𝐈𝐆𝐇𝐓 2025                                                                                                        //
//                                                                                                                                                                                        //
//                                                                                                                                                                                        //
//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//* 
//  * project_name : GAAJU-XMD
//  * author : gaajutech
//  * youtube : https://www.youtube.com/Xchristech 
//  * description : GAAJU-XMD ,A Multi-Device whatsapp user bot.
//*
//*
//re-upload? recode? copy code? give credit to gaajutech 2026:)
//Instagram: gaajutech
//Telegram: t.me/Official_ChrisGaaju
//GitHub: Xchristech2 
//WhatsApp: +2348069675806
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@Xchristech
//   * Created By Github: Xchristech2.
//   * Credit To Chris Gaaju 
//   * © 2025 GAAJU-XMD.
// ⛥┌┤
// */

// ✅ LOCK FILE — Prevent multiple instances
const fs = require('fs');
const path = require('path');

const LOCK_FILE = './bot.lock';
if (fs.existsSync(LOCK_FILE)) {
    try {
        const pid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim());
        process.kill(pid, 0);
        console.log(`❌ Another instance is running (PID: ${pid}). Exiting...`);
        process.exit(1);
    } catch (e) {
        console.log('⚠️ Stale lock file found, removing...');
        fs.unlinkSync(LOCK_FILE);
    }
}
fs.writeFileSync(LOCK_FILE, String(process.pid));

const cleanLock = () => {
    try { fs.unlinkSync(LOCK_FILE); } catch (e) {}
};
process.on('exit', cleanLock);
process.on('SIGINT', cleanLock);
process.on('SIGTERM', cleanLock);
// ✅ END LOCK FILE

//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//

global.File = class File {};
require('./settings');
require('dotenv').config();
const { Boom } = require('@hapi/boom');
const chalk = require('chalk');
const { handleMessages, handleGroupParticipantUpdate } = require('./main');

try { const autorecord = require('./commands/autorecord'); autorecord.stopAllInfiniteRecordings(); } catch (e) {}
try { const autotyping = require('./commands/autotyping'); autotyping.stopAllInfiniteTyping(); } catch (e) {}

const { handleStatusUpdate, handleBulkStatusUpdate } = require('./commands/autostatus');
const { storeMessage } = require('./commands/antidelete');
const PhoneNumber = require('awesome-phonenumber');
const { smsg } = require('./lib/myfunc');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, jidDecode, jidNormalizedUser, makeCacheableSignalKeyStore, delay } = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");
const { rmSync } = require('fs');

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const store = require('./lib/lightweight_store');
store.readFromFile();
const settings = require('./settings');

// ✅ Store write error handling
setInterval(() => {
    try {
        store.writeToFile();
    } catch (e) {
        console.error('❌ Store write failed:', e.message);
    }
}, settings.storeWriteInterval || 10000);

function readStatusConfig() {
    try {
        const p = path.join(__dirname, 'data', 'autostatus.json');
        if (fs.existsSync(p)) { 
            const c = JSON.parse(fs.readFileSync(p, 'utf8')); 
            return { 
                enabled: c.enabled === true, 
                likeOn: c.likeOn === true,
                selfOn: c.selfOn === true
            }; 
        }
    } catch (e) {}
    return { enabled: false, likeOn: false, selfOn: false };
}

function getBotMode() {
    try {
        const p = path.join(__dirname, 'data', 'messageCount.json');
        if (fs.existsSync(p)) { const d = JSON.parse(fs.readFileSync(p, 'utf8')); if (typeof d.isPublic === 'boolean') return d.isPublic ? 'Public' : 'Private'; }
        return 'Public';
    } catch (e) { return 'Public'; }
}

// ✅ Memory guard
setInterval(() => {
    const memMB = process.memoryUsage().rss / 1024 / 1024;
    console.log(`💾 Memory: ${Math.round(memMB)}MB`);
    
    if (memMB > 500) {
        console.log('⚠️ High memory - forcing garbage collection');
        if (global.gc) global.gc();
    }
    if (memMB > 700) {
        console.log('🔴 Critical memory - restarting');
        process.exit(1);
    }
}, 5 * 60 * 1000);

setInterval(() => { if (global.gc) global.gc(); }, 60000);
setInterval(() => { if (process.memoryUsage().rss / 1024 / 1024 > 400) process.exit(1); }, 30000);

let phoneNumber = "2348038915922";
let owner = JSON.parse(fs.readFileSync('./data/owner.json'));
global.botname = "GAAJU-XMD";
global.themeemoji = "🤖";
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;
const question = (text) => rl ? new Promise((resolve) => rl.question(text, resolve)) : Promise.resolve(settings.ownerNumber || phoneNumber);

function getCommandCount() {
    try {
        const c = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
        const re = /case\s+userMessage\s*(===|\.startsWith\(|\.includes\(|\.match\()\s*['"`]\.([^'"`]+)['"`]/g;
        let m, count = 0; while ((m = re.exec(c)) !== null) { if (m[2]) count++; }
        return count || 150;
    } catch (e) { return 150; }
}

async function startXeonBotInc() {
    try {
        reconnectAttempts = 0;
        let { version } = await fetchLatestBaileysVersion();

if (!fs.existsSync('./session/creds.json') && global.sessionid) {
  try {

    let sessionData;
    let sessionString = global.sessionid.trim();

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

    fs.mkdirSync('./session', {
      recursive: true
    });

    fs.writeFileSync(
      './session/creds.json',
      JSON.stringify(sessionData, null, 2)
    );

    console.log('✅ Session restored successfully');

  } catch (err) {

    console.error(
      '❌ Failed to restore session:',
      err.message
    );

  }
}

const { state, saveCreds } = await useMultiFileAuthState('./session');
const msgRetryCounterCache = new NodeCache();
        const XeonBotInc = makeWASocket({
            version, logger: pino({ level: 'silent' }), printQRInTerminal: !pairingCode,
            browser: ["Android", "Chrome", "20.0.04"],
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })) },
            markOnlineOnConnect: true, generateHighQualityLinkPreview: true, syncFullHistory: false,
            getMessage: async (key) => { let j = jidNormalizedUser(key.remoteJid); let m = await store.loadMessage(j, key.id); return m?.message || ""; },
            msgRetryCounterCache, defaultQueryTimeoutMs: 60000, connectTimeoutMs: 60000, keepAliveIntervalMs: 10000,
        });

        XeonBotInc.ev.on('creds.update', saveCreds);
        store.bind(XeonBotInc.ev);

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.message) return;
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    if (mek.key.fromMe) {
                        const statusConfig = readStatusConfig();
                        if (statusConfig.enabled && statusConfig.selfOn) {
                            handleStatusUpdate(XeonBotInc, chatUpdate).catch(err => console.error("Status view error:", err.message));
                        }
                        return;
                    }
                    storeMessage(XeonBotInc, mek);
                    const statusConfig = readStatusConfig();
                    if (statusConfig.enabled === true) {
                        handleStatusUpdate(XeonBotInc, chatUpdate).catch(err => console.error("Status view error:", err.message));
                    }
                }

                if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') { if (!(mek.key?.remoteJid?.endsWith('@g.us'))) return; }
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
                if (XeonBotInc?.msgRetryCounterCache) XeonBotInc.msgRetryCounterCache.clear();

                try { await handleMessages(XeonBotInc, chatUpdate, true); } catch (err) {
                    if (mek.key?.remoteJid && mek.key.remoteJid !== 'status@broadcast') {
                        await XeonBotInc.sendMessage(mek.key.remoteJid, { text: '❌ Error processing message.' }).catch(() => {});
                    }
                }
            } catch (err) {}
        });

        XeonBotInc.decodeJid = (jid) => { if (!jid) return jid; if (/:\d+@/gi.test(jid)) { let d = jidDecode(jid) || {}; return d.user && d.server && d.user + '@' + d.server || jid; } return jid; };
        XeonBotInc.ev.on('contacts.update', update => { for (let c of update) { let id = XeonBotInc.decodeJid(c.id); if (store?.contacts) store.contacts[id] = { id, name: c.notify }; } });
        XeonBotInc.getName = (jid, withoutContact = false) => {
            let id = XeonBotInc.decodeJid(jid); withoutContact = XeonBotInc.withoutContact || withoutContact; let v;
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => { v = store.contacts[id] || {}; if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}; resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international')); });
            else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ? XeonBotInc.user : (store.contacts[id] || {});
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
        };
        XeonBotInc.public = true;
        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store);

        if (pairingCode && !XeonBotInc.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api');
            let pn = global.phoneNumber || await question(chalk.bgBlack(chalk.greenBright(`WhatsApp number (2348038915922): `)));
            pn = pn.replace(/[^0-9]/g, '');
            if (!require('awesome-phonenumber')('+' + pn).isValid()) { console.log(chalk.red('Invalid number.')); process.exit(1); }
            setTimeout(async () => { try { let code = await XeonBotInc.requestPairingCode(pn); code = code?.match(/.{1,4}/g)?.join("-") || code; console.log(chalk.black(chalk.bgGreen(`Code: `)), chalk.black(chalk.white(code))); } catch (e) { console.error('Error:', e); } }, 3000);
        }

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s;
            if (qr) console.log(chalk.cyan('📱 QR Code generated.'));
            if (connection === 'connecting') console.log(chalk.cyan('🔄 Connecting...'));
            
            if (connection == "open") {
                console.log(chalk.cyan(`🌿Connected => ` + JSON.stringify(XeonBotInc.user, null, 2)));
                reconnectAttempts = 0;

                try {
                    console.log('📂 Pre-loading groups into store...');
                    const groups = await XeonBotInc.groupFetchAllParticipating();
                    const groupList = Object.values(groups);
                    console.log(`✅ Loaded ${groupList.length} groups into store`);
                    for (const group of groupList) {
                        if (store.chats) {
                            store.chats[group.id] = { id: group.id, ...group };
                        }
                    }
                } catch (e) {
                    console.error('❌ Failed to pre-load groups:', e.message);
                }

                setInterval(() => {
                    try {
                        const backupDir = './session_backup';
                        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
                        fs.cpSync('./session', backupDir, { recursive: true });
                        console.log('✅ Session backed up');
                    } catch (e) {
                        console.error('❌ Session backup failed:', e.message);
                    }
                }, 60 * 60 * 1000);

                try {
                    const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                    const time = new Date().toLocaleString('en-US', { timeZone: settings.timezone || 'Africa/Lagos', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });

                    const activationMessage = `╭── ◆「 *GAAJU-XMD* 」◆
╰───★─☆─♪♪─◆

╭──◆「 *BOT CONNECTED* 」◆
├
├◇ *📅 Date:* ${time.split(',')[0] || time}
├◇ *⌚ Time:* ${time.split(', ')[1] || time}
├◇ *✅ Status:* Online
├◇ *💻 Version:* ${settings.version}
├◇ *👤 Owner:* Chris Gaaju 
├◇ *📞 Contact:* +2348069675806
├◇ *🌐 Prefix:* ${settings.prefix}
├◇ *🔒 Mode:* ${getBotMode()}
├◇ *💡 Commands:* ${getCommandCount()}+
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *QUICK START* 」◆
├
├◇ *📂 .menu*    → All commands
├◇ *📖 .help*    → Bot guide
├◇ *📞 .owner*   → Contact owner
├◇ *⚙️ .settings* → Bot settings
├◇ *📶 .ping*    → Check speed
├◇ *🔄 .update*  → Update bot
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *CONNECT* 」◆
├
├◇ 💬 Support Group
├◇ 📺 YouTube Channel
├◇ ⭐ GitHub Repo
├◇ 🔔 Channel Updates
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *LINKS* 」◆
├
├◇ *🔗 Channel:* ${global.channelLink}
├
├◇ *💬 Support:* ${global.supportLink || 'https://chat.whatsapp.com/HgGLuDF6ZNABneNTbdrtUQ?mode=hqrt1'}
├
├◇ *📺 YouTube:* ${global.ytch || 'https://youtube.com/@Xchristech'}
├
├◇ *⭐ GitHub:* https://github.com/Xchristech2 
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *COPYRIGHT* 」◆
├
├◇ © 2025-2026
├◇ GAAJU-XMD
├◇ All Rights Reserved.
├
╰───★─☆─♪♪─◆`;

                    let imageBuffer;
                    const imgPath = path.join(__dirname, 'assets', 'bot_image.jpg');
                    const repoImgUrl = 'https://raw.githubusercontent.com/Xchristech2/GAAJU-XMD/main/assets/bot_image.jpg';

                    if (fs.existsSync(imgPath)) {
                        imageBuffer = fs.readFileSync(imgPath);
                    } else {
                        try {
                            const res = await fetch(repoImgUrl);
                            if (res.ok) imageBuffer = await res.buffer();
                        } catch (e) {}
                    }

if (imageBuffer) {
    await XeonBotInc.sendMessage(botNumber, {
        image: imageBuffer,
        caption: activationMessage,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: '‎',
                serverMessageId: -1
            }
        }
    });
} else {
    await XeonBotInc.sendMessage(botNumber, { 
        text: activationMessage,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: '‎',
                serverMessageId: -1
            }
        }
    });
}
                } catch (e) { console.error('Error sending activation:', e.message); }
                await delay(1999);
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'GAAJU-XMD'} ]`)}\n\n`));
                console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected! ✅`));
            }
            
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    console.log('❌ Logged out - delete session and re-pair');
                    try { rmSync('./session', { recursive: true, force: true }); } catch (e) {}
                    return;
                }
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts++;
                    const delayMs = Math.min(5000 * reconnectAttempts, 30000);
                    console.log(`🔄 Reconnecting in ${delayMs/1000}s (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                    setTimeout(startXeonBotInc, delayMs);
                } else {
                    console.log('❌ Max reconnect attempts reached - restart manually');
                    process.exit(1);
                }
            }
        });

        const { handleAnticall } = require('./commands/anticall');
        XeonBotInc.ev.on('call', async (calls) => { await handleAnticall(XeonBotInc, calls); });
        XeonBotInc.ev.on('group-participants.update', async (update) => { await handleGroupParticipantUpdate(XeonBotInc, update); });

        XeonBotInc.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.messages.length <= 1) return;
            const statusMessages = m.messages.filter(msg => msg.key && msg.key.remoteJid === 'status@broadcast' && !msg.key.fromMe && msg.key.participant);
            if (statusMessages.length > 0) {
                const statusConfig = readStatusConfig();
                if (statusConfig.enabled === true) { handleBulkStatusUpdate(XeonBotInc, statusMessages).catch(err => console.error("Bulk status error:", err.message)); }
            }
        });

        return XeonBotInc;
    } catch (error) {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) { reconnectAttempts++; await delay(5000 * reconnectAttempts); startXeonBotInc(); }
    }
}

process.on('SIGINT', async () => { try { require('./commands/autorecord').stopAllInfiniteRecordings(); } catch (e) {} try { require('./commands/autotyping').stopAllInfiniteTyping(); } catch (e) {} process.exit(0); });
process.on('SIGTERM', async () => { try { require('./commands/autorecord').stopAllInfiniteRecordings(); } catch (e) {} try { require('./commands/autotyping').stopAllInfiniteTyping(); } catch (e) {} process.exit(0); });

console.log(chalk.cyan('🚀 Starting GAAJU-XMD Bot...'));
startXeonBotInc().catch(error => { console.error('Fatal error:', error); process.exit(1); });

process.on('uncaughtException', (err) => { console.error('Uncaught Exception:', err); });
process.on('unhandledRejection', (err) => { console.error('Unhandled Rejection:', err); });

let file = require.resolve(__filename);
fs.watchFile(file, () => { fs.unwatchFile(file); console.log(chalk.redBright(`Update ${__filename}`)); delete require.cache[file]; require(file); }); 
