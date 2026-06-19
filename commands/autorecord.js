/**
 * GAAJU-XMD - A WhatsApp Bot
 * Autorecord Command - Shows fake recording status (with infinite mode)
 */
 
const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const configPath = path.join(__dirname, '..', 'data', 'autorecord.json');
const activeInfiniteSessions = new Map();

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363406588763460@newsletter',
            newsletterName: 'GAAJU-XMD BOTS',
            serverMessageId: -1
        }
    }
};

const DEFAULT_DURATION = 60;

function initConfig() {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify({ enabled: false, mode: 'all', duration: DEFAULT_DURATION, infinite: false }, null, 2));
        }
        const config = JSON.parse(fs.readFileSync(configPath));
        if (config.infinite === undefined) { config.infinite = false; fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); }
        return config;
    } catch (error) { return { enabled: false, mode: 'all', duration: DEFAULT_DURATION, infinite: false }; }
}

function stopInfiniteRecording(chatId) {
    const session = activeInfiniteSessions.get(chatId);
    if (session && session.intervalId) { clearInterval(session.intervalId); activeInfiniteSessions.delete(chatId); return true; }
    return false;
}

function stopAllInfiniteRecordings() {
    let count = 0;
    for (const [chatId, session] of activeInfiniteSessions.entries()) { clearInterval(session.intervalId); activeInfiniteSessions.delete(chatId); count++; }
    if (count > 0) console.log(`🛑 Stopped ${count} infinite recording sessions`);
    return count;
}

async function startInfiniteRecording(sock, chatId) {
    stopInfiniteRecording(chatId);
    try {
        await sock.presenceSubscribe(chatId);
        await delay(200);
        await sock.sendPresenceUpdate('available', chatId);
        await delay(300);
        await sock.sendPresenceUpdate('recording', chatId);
        const session = { chatId, startTime: Date.now(), refreshCount: 0 };
        session.intervalId = setInterval(async () => {
            try { await sock.sendPresenceUpdate('recording', chatId); session.refreshCount++; } catch (e) { stopInfiniteRecording(chatId); }
        }, 10000);
        activeInfiniteSessions.set(chatId, session);
        return true;
    } catch (e) { return false; }
}

async function autorecordCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        if (!message.key.fromMe && !isOwner) { await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner!', ...channelInfo }); return; }

        const userMessage = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        let commandPart = userMessage.trim();
        if (commandPart.startsWith('.')) commandPart = commandPart.substring(1);
        const parts = commandPart.split(/\s+/);
        const args = parts.slice(1);
        const config = initConfig();

        if (args.length === 0) {
            const status = config.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const statusIcon = config.enabled ? '🟢' : '🔴';
            const modeText = getModeText(config.mode);
            const infiniteStatus = config.infinite ? '♾️ ON' : '⏱️ OFF';
            const sessions = activeInfiniteSessions.size;
            await sock.sendMessage(chatId, { text: `🎙️ *AUTO-RECORD SETTINGS*\n\n${statusIcon} *Status:* ${status}\n━━━━━━━━━━━━━━━━━━━━\n🎯 *Mode:* ${modeText}\n⏱️ *Duration:* ${config.infinite ? '♾️ Infinite' : config.duration + ' seconds'}\n♾️ *Infinite Mode:* ${infiniteStatus}\n🔄 *Active Sessions:* ${sessions}\n\n━━━━━━━━━━━━━━━━━━━━\n📖 *Commands:*\n└ .autorecord on/off\n└ .autorecord mode all/dms/groups\n└ .autorecord duration <seconds>\n└ .autorecord infinite on/off/stop\n└ .autorecord status\n\n💡 *Examples:*\n└ .autorecord duration 30\n└ .autorecord infinite on`, ...channelInfo });
            return;
        }

        const action = args[0].toLowerCase();

        if (action === 'on' || action === 'enable') {
            if (config.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n🎙️ Auto-Record is already *ON*.\n\n💡 Use .autorecord off to disable.`, ...channelInfo }); return; }
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, { text: `✅ *AUTO-RECORD ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n🎯 Mode: ${getModeText(config.mode)}\n⏱️ Duration: ${config.infinite ? '♾️ Infinite' : config.duration + ' seconds'}\n♾️ Infinite: ${config.infinite ? 'ON' : 'OFF'}\n\n📌 Recording indicators active in ${getModeDescription(config.mode)}`, ...channelInfo });
            if (config.infinite && shouldShowRecording(chatId)) await startInfiniteRecording(sock, chatId);
        } else if (action === 'off' || action === 'disable') {
            if (!config.enabled) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n🎙️ Auto-Record is already *OFF*.\n\n💡 Use .autorecord on to enable.`, ...channelInfo }); return; }
            const stopped = stopAllInfiniteRecordings();
            config.enabled = false;
            config.infinite = false;
            config.duration = DEFAULT_DURATION;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, { text: `❌ *AUTO-RECORD DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n🛑 Recording stopped.\n🔄 Stopped ${stopped} active session(s).\n⏱️ Duration reset to ${DEFAULT_DURATION}s.\n\n💡 Use .autorecord on to enable.`, ...channelInfo });
        } else if (action === 'mode') {
            if (args.length < 2) { await sock.sendMessage(chatId, { text: `⚠️ *USAGE*\n\n━━━━━━━━━━━━━━━━━━━━\n📖 .autorecord mode <all/dms/groups>\n\n✨ *Example:*\n└ .autorecord mode groups`, ...channelInfo }); return; }
            const mode = args[1].toLowerCase();
            if (mode === 'all' || mode === 'dms' || mode === 'groups') {
                config.mode = mode;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                await sock.sendMessage(chatId, { text: `🎯 *MODE UPDATED*\n\n━━━━━━━━━━━━━━━━━━━━\n└ New mode: ${getModeText(mode)}\n\n📌 ${getModeDescription(mode)}`, ...channelInfo });
            } else {
                await sock.sendMessage(chatId, { text: `⚠️ *INVALID MODE*\n\n━━━━━━━━━━━━━━━━━━━━\n📖 Available: all, dms, groups`, ...channelInfo });
            }
        } else if (action === 'duration') {
            if (args.length < 2) { await sock.sendMessage(chatId, { text: `⚠️ *USAGE*\n\n━━━━━━━━━━━━━━━━━━━━\n📖 .autorecord duration <seconds>\n💡 Use 'infinite' for unlimited\n\n✨ *Example:*\n└ .autorecord duration 30\n└ .autorecord duration infinite`, ...channelInfo }); return; }
            if (args[1].toLowerCase() === 'infinite') {
                if (config.infinite) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY INFINITE*\n\n━━━━━━━━━━━━━━━━━━━━\n♾️ Infinite recording is already *ON*.\n\n💡 Use .autorecord infinite off to disable.`, ...channelInfo }); return; }
                config.infinite = true;
                config.duration = DEFAULT_DURATION;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                await sock.sendMessage(chatId, { text: `♾️ *INFINITE MODE ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 Recording will continue indefinitely.\n🔄 Auto-refresh every 10 seconds.\n\n💡 Use .autorecord infinite stop to stop.`, ...channelInfo });
                if (config.enabled && shouldShowRecording(chatId)) await startInfiniteRecording(sock, chatId);
                return;
            }
            const duration = parseInt(args[1]);
            if (isNaN(duration) || duration < 5 || duration > 120) { await sock.sendMessage(chatId, { text: `⚠️ *INVALID DURATION*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 Duration must be between 5-120 seconds.\n💡 Use 'infinite' for unlimited.`, ...channelInfo }); return; }
            config.duration = duration;
            config.infinite = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            stopAllInfiniteRecordings();
            await sock.sendMessage(chatId, { text: `⏱️ *DURATION UPDATED*\n\n━━━━━━━━━━━━━━━━━━━━\n└ Recording duration: ${duration} seconds\n└ Infinite mode: OFF`, ...channelInfo });
        } else if (action === 'infinite') {
            if (args.length < 2) { await sock.sendMessage(chatId, { text: `♾️ *INFINITE MODE*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 Status: ${config.infinite ? '✅ ON' : '❌ OFF'}\n🔄 Active Sessions: ${activeInfiniteSessions.size}\n\n📖 Commands:\n└ .autorecord infinite on\n└ .autorecord infinite off\n└ .autorecord infinite stop`, ...channelInfo }); return; }
            const sub = args[1].toLowerCase();
            if (sub === 'on' || sub === 'enable') {
                if (config.infinite) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY INFINITE*\n\n━━━━━━━━━━━━━━━━━━━━\n♾️ Infinite is already *ON*.\n\n💡 Use .autorecord infinite off to disable.`, ...channelInfo }); return; }
                config.infinite = true;
                config.duration = DEFAULT_DURATION;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                await sock.sendMessage(chatId, { text: `♾️ *INFINITE ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 Recording will continue indefinitely.\n🔄 Auto-refresh every 10 seconds.`, ...channelInfo });
                if (config.enabled && shouldShowRecording(chatId)) await startInfiniteRecording(sock, chatId);
            } else if (sub === 'off' || sub === 'disable') {
                if (!config.infinite) { await sock.sendMessage(chatId, { text: `⚠️ *ALREADY DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n♾️ Infinite is already *OFF*.\n\n💡 Use .autorecord infinite on to enable.`, ...channelInfo }); return; }
                config.infinite = false;
                config.duration = DEFAULT_DURATION;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                const stopped = stopAllInfiniteRecordings();
                await sock.sendMessage(chatId, { text: `⏱️ *INFINITE DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━\n🛑 Stopped ${stopped} session(s).\n⏱️ Duration reset to ${DEFAULT_DURATION}s.`, ...channelInfo });
            } else if (sub === 'stop') {
                const stopped = stopAllInfiniteRecordings();
                await sock.sendMessage(chatId, { text: stopped > 0 ? `🛑 *STOPPED*\n\n━━━━━━━━━━━━━━━━━━━━\n🔄 Stopped ${stopped} active recording session(s).\n\n💡 Recording will resume on next message.` : `⚠️ *NO ACTIVE SESSIONS*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 No infinite recording sessions running.`, ...channelInfo });
            }
        } else if (action === 'status') {
            const sessions = activeInfiniteSessions.size;
            let info = '';
            if (sessions > 0) { for (const [chat, s] of activeInfiniteSessions.entries()) { const t = Math.floor((Date.now() - s.startTime) / 1000); info += `└ ${chat.substring(0,15)}... : ${Math.floor(t/60)}m ${t%60}s\n`; } }
            await sock.sendMessage(chatId, { text: `🎙️ *AUTO-RECORD STATUS*\n\n${config.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}\n━━━━━━━━━━━━━━━━━━━━\n🎯 Mode: ${getModeText(config.mode)}\n⏱️ Duration: ${config.infinite ? '♾️ Infinite' : config.duration + 's'}\n♾️ Infinite: ${config.infinite ? 'ON' : 'OFF'}\n🔄 Sessions: ${sessions}${info ? '\n\n' + info : ''}`, ...channelInfo });
        } else {
            await sock.sendMessage(chatId, { text: `⚠️ *INVALID COMMAND*\n\n━━━━━━━━━━━━━━━━━━━━\n📖 *Commands:*\n└ .autorecord on/off\n└ .autorecord mode all/dms/groups\n└ .autorecord duration <seconds>\n└ .autorecord infinite on/off/stop\n└ .autorecord status`, ...channelInfo });
        }
    } catch (error) { console.error('❌ Error:', error); }
}

function getModeText(mode) { switch(mode) { case 'all': return '🌍 All Chats'; case 'dms': return '💬 DMs Only'; case 'groups': return '👥 Groups Only'; default: return '🌍 All Chats'; } }
function getModeDescription(mode) { switch(mode) { case 'all': return 'both DMs and groups.'; case 'dms': return 'private messages only.'; case 'groups': return 'group chats only.'; default: return 'both DMs and groups.'; } }
function shouldShowRecording(chatId) { try { const config = initConfig(); if (!config.enabled) return false; const isGroup = chatId.endsWith('@g.us'); switch(config.mode) { case 'all': return true; case 'dms': return !isGroup; case 'groups': return isGroup; default: return true; } } catch (e) { return false; } }
function isAutorecordEnabled() { try { return initConfig().enabled; } catch (e) { return false; } }

async function handleAutorecordForMessage(sock, chatId, userMessage) {
    if (!shouldShowRecording(chatId)) return false;
    try {
        const config = initConfig();
        if (config.infinite) return await startInfiniteRecording(sock, chatId);
        const duration = config.duration || DEFAULT_DURATION;
        const refreshMs = duration <= 10 ? 2000 : 5000;
        const totalLoops = Math.floor((duration * 1000) / refreshMs);
        await sock.presenceSubscribe(chatId);
        await delay(200);
        await sock.sendPresenceUpdate('recording', chatId);
        for (let i = 0; i < totalLoops; i++) { await delay(refreshMs); await sock.sendPresenceUpdate('recording', chatId); }
        await delay(1000);
        await sock.sendPresenceUpdate('paused', chatId);
        return true;
    } catch (e) { return false; }
}
async function handleAutorecordForCommand(sock, chatId) { return await handleAutorecordForMessage(sock, chatId, ''); }
async function showRecordingAfterCommand(sock, chatId) { return await handleAutorecordForMessage(sock, chatId, ''); }

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { autorecordCommand, isAutorecordEnabled, shouldShowRecording, handleAutorecordForMessage, handleAutorecordForCommand, showRecordingAfterCommand, stopInfiniteRecording, stopAllInfiniteRecordings, startInfiniteRecording, initConfig };
