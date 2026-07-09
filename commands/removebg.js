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
/**
 * GAAJU-XMD - Remove Background Command (.removebg)
 * Powered by Remove.BG API — Multi-key + User keys + URL support
 * Features: Reply to image | Image URL | Set/Remove API key | Loading animation
 * Professional Version
 */

const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const PROXY_URL = 'https://gemini-proxy-10a1.onrender.com';
const USER_KEYS_FILE = path.join(__dirname, '../data/removebg_keys.json');

const BAR_FRAMES = [
    '[□□□□□□□□□□] 0%',
    '[■□□□□□□□□□] 10%',
    '[■■□□□□□□□□] 20%',
    '[■■■□□□□□□□] 30%',
    '[■■■■□□□□□□] 40%',
    '[■■■■■□□□□□] 50%',
    '[■■■■■■□□□□] 60%',
    '[■■■■■■■□□□] 70%',
    '[■■■■■■■■□□] 80%',
    '[■■■■■■■■■□] 90%',
    '[■■■■■■■■■■] 100%'
];

// ═══════════════════════════════════════
// USER KEY MANAGEMENT
// ═══════════════════════════════════════

function readUserKeys() {
    try {
        if (fs.existsSync(USER_KEYS_FILE)) return JSON.parse(fs.readFileSync(USER_KEYS_FILE, 'utf8'));
    } catch (e) {}
    return {};
}

function saveUserKey(userNumber, key) {
    const keys = readUserKeys();
    keys[userNumber] = key;
    const dir = path.dirname(USER_KEYS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USER_KEYS_FILE, JSON.stringify(keys, null, 2));
}

function removeUserKey(userNumber) {
    const keys = readUserKeys();
    delete keys[userNumber];
    fs.writeFileSync(USER_KEYS_FILE, JSON.stringify(keys, null, 2));
}

function getUserKey(userNumber) {
    return readUserKeys()[userNumber] || null;
}

// ═══════════════════════════════════════
// PROXY KEY
// ═══════════════════════════════════════

async function getProxyKeys() {
    try {
        const res = await fetch(`${PROXY_URL}/v1/removebg-key`, {
            headers: { 'x-bot-repo': 'Xchristech2/GAAJU-XMD' }
        });
        const data = await res.json();
        return data.keys || [data.key];
    } catch (e) {
        return [];
    }
}

// ═══════════════════════════════════════
// IMAGE BUFFER
// ═══════════════════════════════════════

async function getImageBuffer(sock, message) {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted?.imageMessage) {
            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            return Buffer.concat(chunks);
        }
        if (message.message?.imageMessage) {
            const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            return Buffer.concat(chunks);
        }
        return null;
    } catch (error) {
        return null;
    }
}

// ═══════════════════════════════════════
// REMOVE.BG CALL
// ═══════════════════════════════════════

async function callRemoveBg(imageBuffer, apiKey) {
    const formData = new FormData();
    formData.append('image_file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
    });
    formData.append('size', 'auto');

    const response = await axios({
        method: 'POST',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        headers: {
            'X-Api-Key': apiKey,
            ...formData.getHeaders()
        },
        responseType: 'arraybuffer',
        timeout: 60000
    });

    if (response.status === 200 && response.data && response.data.length > 5000) {
        return response.data;
    }
    throw new Error('Invalid response');
}

// ═══════════════════════════════════════
// MAIN COMMAND
// ═══════════════════════════════════════

module.exports = {
    name: 'removebg',
    alias: ['rmbg', 'nobg'],
    category: 'tools',
    desc: 'Remove background from images',
    async exec(sock, message, args) {
        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const userNumber = senderId.split('@')[0];
        const fullText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const cmdArgs = fullText.split(' ').slice(1).join(' ').trim();
        let loadingMsg;
        let imageBuffer;

        // ═══ .removebg apikey=xxx ═══
        if (cmdArgs.toLowerCase().startsWith('apikey=')) {
            const newKey = cmdArgs.substring(7).trim();
            if (!newKey || newKey.length < 5) {
                return sock.sendMessage(chatId, {
                    text: `╭──◆「 *INVALID KEY* 」◆\n├\n├◇ ❌ Key too short\n├◇ 💡 Get free key:\n├  └ remove.bg/api\n├◇ 💡 Format:\n├  └ .removebg apikey=YOUR_KEY\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`
                }, { quoted: message });
            }
            saveUserKey(userNumber, newKey);
            return sock.sendMessage(chatId, {
                text: `╭──◆「 *API KEY SAVED* 」◆\n├\n├◇ ✅ Your key has been saved\n├◇ 🔑 Key: ${newKey.substring(0, 6)}...${newKey.substring(newKey.length - 4)}\n├◇ 🎯 Your key will be used first\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`
            }, { quoted: message });
        }

        // ═══ .removebg removekey ═══
        if (cmdArgs.toLowerCase() === 'removekey') {
            removeUserKey(userNumber);
            return sock.sendMessage(chatId, {
                text: `╭──◆「 *API KEY REMOVED* 」◆\n├\n├◇ ✅ Your key has been removed\n├◇ 🎯 Using developer's key\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`
            }, { quoted: message });
        }

        // ═══ Normal removebg ═══
        try {
            // Check for URL in quoted message
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMessage) {
                const quotedText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || quotedMessage.imageMessage?.caption || '';
                const urlMatch = quotedText.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)[^\s]*)/i);
                if (urlMatch) {
                    try {
                        const urlRes = await fetch(urlMatch[0]);
                        if (urlRes.ok) {
                            imageBuffer = await urlRes.buffer();
                        }
                    } catch (e) {}
                }
            }

            // Check for URL in command itself
            if (!imageBuffer) {
                const urlMatch = cmdArgs.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)[^\s]*)/i);
                if (urlMatch) {
                    try {
                        const urlRes = await fetch(urlMatch[0]);
                        if (!urlRes.ok) throw new Error('Invalid URL');
                        imageBuffer = await urlRes.buffer();
                    } catch (e) {
                        return sock.sendMessage(chatId, {
                            text: `╭──◆「 *INVALID URL* 」◆\n├\n├◇ ❌ Could not download image\n├◇ 💡 Check the URL is valid\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`
                        }, { quoted: message });
                    }
                }
            }

            // Fallback to attached image
            if (!imageBuffer) {
                imageBuffer = await getImageBuffer(sock, message);
            }

            if (!imageBuffer) {
                const userKey = getUserKey(userNumber);
                const keyStatus = userKey ? '✅ Set' : '❌ Not set';
                return await sock.sendMessage(chatId, {
                    text: `╭──◆「 *REMOVE BACKGROUND* 」◆\n` +
                          `├\n` +
                          `├◇ 📸 Remove image backgrounds\n` +
                          `├◇ 🎯 Powered by Remove.BG\n` +
                          `├\n` +
                          `├◇ *📖 Usage:*\n` +
                          `├  └ Reply to image with .removebg\n` +
                          `├  └ .removebg <image_url>\n` +
                          `├  └ Reply to URL with .removebg\n` +
                          `├  └ .removebg apikey=KEY → Set key\n` +
                          `├  └ .removebg removekey → Remove key\n` +
                          `├\n` +
                          `├◇ *🔑 Key Status:*\n` +
                          `├  └ Your key: ${keyStatus}\n` +
                          `├  └ Fallback: Developer's key\n` +
                          `├\n` +
                          `╰─┬─★─☆─♪♪─◆\n\n` +
                          `╭──◆「 *GAAJU-XMD* 」◆\n` +
                          `╰───★─☆─♪♪─◆`
                }, { quoted: message });
            }

            // Start animation
            loadingMsg = await sock.sendMessage(chatId, { text: `Removing bg ${BAR_FRAMES[0]}` });

            // Get all keys: user key first, then proxy keys
            const userKey = getUserKey(userNumber);
            const proxyKeys = await getProxyKeys();
            const allKeys = userKey ? [userKey, ...proxyKeys] : proxyKeys;

            if (allKeys.length === 0) throw new Error('NO_KEYS');

            let resultBuffer = null;
            let usedKeyType = 'developer';

            const imagePromise = (async () => {
                for (let i = 0; i < allKeys.length; i++) {
                    try {
                        const res = await callRemoveBg(imageBuffer, allKeys[i]);
                        usedKeyType = i === 0 && userKey ? 'your' : 'developer';
                        return res;
                    } catch (e) {
                        if (e.response?.status === 402) continue;
                    }
                }
                throw new Error('ALL_FAILED');
            })();

            // Play animation while API works (250ms per frame)
            for (let frame = 0; frame < BAR_FRAMES.length - 1; frame++) {
                await new Promise(resolve => setTimeout(resolve, 250));
                try {
                    await sock.sendMessage(chatId, {
                        edit: loadingMsg.key,
                        text: `Removing bg ${BAR_FRAMES[frame + 1]}`
                    });
                } catch (e) {}
            }

            resultBuffer = await imagePromise;

            // Show done
            await sock.sendMessage(chatId, { edit: loadingMsg.key, text: `Removing done ${BAR_FRAMES[10]}` });

            await sock.sendMessage(chatId, {
                image: resultBuffer,
                caption: `╭──◆「 *BACKGROUND REMOVED* 」◆\n` +
                         `├\n` +
                         `├◇ ✅ Successfully processed!\n` +
                         `├◇ 🔑 Used: ${usedKeyType} key\n` +
                         `├◇ 🎯 Powered by Remove.BG\n` +
                         `├\n` +
                         `╰─┬─★─☆─♪♪─◆\n\n` +
                         `╭──◆「 *GAAJU-XMD* 」◆\n` +
                         `╰───★─☆─♪♪─◆`
            }, { quoted: message });

        } catch (error) {
            if (loadingMsg) { try { await sock.sendMessage(chatId, { edit: loadingMsg.key, text: 'Failed [■■■■■■□□□□]' }); } catch (e) {} }

            let errorMsg = `╭──◆「 *REMOVAL FAILED* 」◆\n├\n├◇ ❌ Unable to remove background\n├◇ 💡 Try a different image\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`;

            if (error.message === 'ALL_FAILED') {
                errorMsg = `╭──◆「 *API LIMIT* 」◆\n├\n├◇ 💳 All keys exhausted\n├◇ 💡 Add your own key:\n├  └ .removebg apikey=YOUR_KEY\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆`;
            }

            await sock.sendMessage(chatId, { text: errorMsg }, { quoted: message });
        }
    }
};
