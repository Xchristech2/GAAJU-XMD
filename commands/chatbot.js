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
//GitHub: wallyjaytechh
//WhatsApp: +2348069675806
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@Xchristech
//   * Created By Github: gaajutech.
//   * Credit To ally jay tech
//   * © 2026 GAAJU-XMD.
// ⛥┌┤
// */
/**
 * GAAJU-XMD - Chatbot Command (.chatbot)
 * Powered by Pollinations GPT — Free, Fast, Unlimited
 * Features: DM/Group/Status toggle | Typing indicator | Usage guide
 * Professional Version
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const CHATBOT_DATA = path.join(__dirname, '../data/chatbot.json');

function loadChatbotData() {
    try {
        if (fs.existsSync(CHATBOT_DATA)) return JSON.parse(fs.readFileSync(CHATBOT_DATA, 'utf8'));
    } catch (e) {}
    return { dms: false, groups: false, status: false, chats: {} };
}

function saveChatbotData(data) {
    const dir = path.dirname(CHATBOT_DATA);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CHATBOT_DATA, JSON.stringify(data, null, 2));
}

function reply(sock, chatId, msg, quoted) {
    return sock.sendMessage(chatId, { text: msg }, { quoted });
}

async function chatbotCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isOwner = message.key.fromMe || senderId === botNumber;
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const args = text.split(' ').slice(1);
        const subCommand = args.join(' ').toLowerCase().trim();
        const data = loadChatbotData();

        if (!isOwner) {
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ❌ Only bot owner can use this
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'usage' || subCommand === 'help') {
            return reply(sock, chatId, `╭──◆「 *CHATBOT USAGE* 」◆
├
├◇ .chatbot dms on
├  └ Enable auto-reply in all private chats
├
├◇ .chatbot dms off
├  └ Disable auto-reply in all private chats
├
├◇ .chatbot group on
├  └ Enable auto-reply in all groups
├
├◇ .chatbot group off
├  └ Disable auto-reply in all groups
├
├◇ .chatbot status on
├  └ Reply to status captions
├
├◇ .chatbot status off
├  └ Don't reply to status captions
├
├◇ .chatbot on
├  └ Enable for this chat only
├
├◇ .chatbot off
├  └ Disable for this chat only
├
├◇ .chatbot
├  └ Show current settings
├
├◇ .chatbot usage
├  └ Show this guide
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'dms on') {
            if (data.dms) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ DMs are already ON
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.dms = true;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ✅ DMs enabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'dms off') {
            if (!data.dms) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ DMs are already OFF
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.dms = false;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ❌ DMs disabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'group on' || subCommand === 'groups on') {
            if (data.groups) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Groups are already ON
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.groups = true;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ✅ Groups enabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'group off' || subCommand === 'groups off') {
            if (!data.groups) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Groups are already OFF
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.groups = false;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ❌ Groups disabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'status on') {
            if (data.status) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Status replies are already ON
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.status = true;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ✅ Status replies enabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'status off') {
            if (!data.status) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Status replies are already OFF
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.status = false;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ❌ Status replies disabled
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'on') {
            if (data.chats[chatId] === true) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Already ON for this chat
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.chats[chatId] = true;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ✅ Enabled for this chat
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        if (subCommand === 'off') {
            if (data.chats[chatId] === false) {
                return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ⚠️ Already OFF for this chat
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
            }
            data.chats[chatId] = false;
            saveChatbotData(data);
            return reply(sock, chatId, `╭──◆「 *CHATBOT* 」◆
├
├◇ ❌ Disabled for this chat
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);
        }

        const isGroup = chatId.endsWith('@g.us');
        const chatStatus = data.chats[chatId];
        const currentStatus = chatStatus === false ? '❌ Off (this chat)' :
                      chatStatus === true ? '✅ On (this chat)' :
                      isGroup && data.groups ? '✅ On (all groups)' :
                      !isGroup && data.dms ? '✅ On (all DMs)' :
                      '❌ Off';

        return reply(sock, chatId, `╭──◆「 *CHATBOT STATUS* 」◆
├
├◇ *DMs:* ${data.dms ? '✅ On' : '❌ Off'}
├◇ *Groups:* ${data.groups ? '✅ On' : '❌ Off'}
├◇ *Status:* ${data.status ? '✅ On' : '❌ Off'}
├◇ *This Chat:* ${currentStatus}
├
├◇ *Commands:*
├  └ .chatbot dms on/off
├  └ .chatbot group on/off
├  └ .chatbot status on/off
├  └ .chatbot on/off
├  └ .chatbot usage
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`, message);

    } catch (error) {
        console.error('Chatbot command error:', error.message);
    }
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    try {
        const data = loadChatbotData();
        const isGroup = chatId.endsWith('@g.us');

        if (chatId === 'status@broadcast') {
            if (!data.status) return;
        } else {
            const chatSetting = data.chats[chatId];
            if (chatSetting === false) return;
            if (chatSetting !== true) {
                if (isGroup && !data.groups) return;
                if (!isGroup && !data.dms) return;
            }
        }

        if (userMessage.startsWith('.') || message.key.fromMe) return;

        const prompt = `You are a friendly WhatsApp user chatting casually. Be short, natural, use emojis. Match the vibe. Don't sound like AI, talk like a real person.

Message from ${chatId === 'status@broadcast' ? 'status' : isGroup ? 'group' : 'DM'}: ${userMessage}`;

        await sock.sendPresenceUpdate('composing', chatId);

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        await sock.sendPresenceUpdate('paused', chatId);

        const result = await response.json();
        const replyText = result.choices?.[0]?.message?.content;

        if (replyText && replyText.length > 2) {
            await sock.sendMessage(chatId, { text: replyText.trim() }, { quoted: message });
        }

    } catch (error) {
        console.error('Chatbot response error:', error.message);
    }
}

module.exports = { chatbotCommand, handleChatbotResponse };