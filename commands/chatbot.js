const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const CHATBOT_DATA = path.join(__dirname, '../data/chatbot.json');

const OWNER_NAME = 'Chris Gaaju';
const OWNER_NUMBER = '+2348069675806';

const DEPLOY_REPO = 'https://github.com/Xchristech2/GAAJU-XMD/fork';
const DEPLOY_VIDEO = 'https://youtu.be/JV4vcawI6fI?si=Ds_NPBOrjrBuKPE8';

const TEST_GROUP = 'https://chat.whatsapp.com/E4SnKL0H0gxL7aGvqAwB9L?s=cl&p=a&mlu=4&ilr=4';
const OFFICIAL_GROUP = 'https://chat.whatsapp.com/DXksVb4su2cHKxrmKktHQd?s=cl&p=a&mlu=4&ilr=4';

const BOT_OFFICIAL_CHANNEL = 'https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z';
const CHRIS_OFFICIAL_CHANNEL = 'https://whatsapp.com/channel/0029Vb7uy9Z1iUxf54ZnHs3N';

function loadChatbotData() {
    try {
        if (fs.existsSync(CHATBOT_DATA)) {
            return {
                dms: false,
                groups: false,
                status: false,
                chats: {},
                ...JSON.parse(fs.readFileSync(CHATBOT_DATA, 'utf8'))
            };
        }
    } catch (e) {}

    return {
        dms: false,
        groups: false,
        status: false,
        chats: {}
    };
}

function saveChatbotData(data) {
    const dir = path.dirname(CHATBOT_DATA);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CHATBOT_DATA, JSON.stringify(data, null, 2));
}

function reply(sock, chatId, msg, quoted) {
    return sock.sendMessage(chatId, { text: msg }, { quoted });
}

function chatbotStyle(title, body) {
    return `╭─⌈ *${title}* ⌋\n${body}\n╰⊷`;
}

async function chatbotCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isOwner = message.key.fromMe || senderId === botNumber;

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';

        const args = text.split(' ').slice(1);
        const subCommand = args.join(' ').toLowerCase().trim();
        const data = loadChatbotData();

        if (!isOwner) {
            return reply(
                sock,
                chatId,
                chatbotStyle(
                    'CHATBOT',
                    '│ ❌ Only the bot owner can change chatbot settings.'
                ),
                message
            );
        }

        if (subCommand === 'usage' || subCommand === 'help') {
            return reply(
                sock,
                chatId,
                chatbotStyle(
                    'CHATBOT SETTINGS',
                    `│
│ *DMs*
│ ⤷ .chatbot dms on
│ ⤷ .chatbot dms off
│
│ *Groups*
│ ⤷ .chatbot group on
│ ⤷ .chatbot group off
│
│ *Status*
│ ⤷ .chatbot status on
│ ⤷ .chatbot status off
│
│ *This Chat*
│ ⤷ .chatbot on
│ ⤷ .chatbot off
│
│ ⤷ .chatbot
│ ⤷ .chatbot usage`
                ),
                message
            );
        }

        if (subCommand === 'dms on') {
            data.dms = true;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ✅ Automatic replies in DMs are now enabled.'),
                message
            );
        }

        if (subCommand === 'dms off') {
            data.dms = false;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ❌ Automatic replies in DMs are now disabled.'),
                message
            );
        }

        if (subCommand === 'group on' || subCommand === 'groups on') {
            data.groups = true;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ✅ Automatic replies in groups are now enabled.'),
                message
            );
        }

        if (subCommand === 'group off' || subCommand === 'groups off') {
            data.groups = false;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ❌ Automatic replies in groups are now disabled.'),
                message
            );
        }

        if (subCommand === 'status on') {
            data.status = true;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ✅ Automatic replies to statuses are now enabled.'),
                message
            );
        }

        if (subCommand === 'status off') {
            data.status = false;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ❌ Automatic replies to statuses are now disabled.'),
                message
            );
        }

        if (subCommand === 'on') {
            data.chats[chatId] = true;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ✅ Chatbot enabled for this chat.'),
                message
            );
        }

        if (subCommand === 'off') {
            data.chats[chatId] = false;
            saveChatbotData(data);

            return reply(
                sock,
                chatId,
                chatbotStyle('CHATBOT', '│ ❌ Chatbot disabled for this chat.'),
                message
            );
        }

        return reply(
            sock,
            chatId,
            chatbotStyle(
                'CHATBOT STATUS',
                `│ DMs: ${data.dms ? '✅ ON' : '❌ OFF'}
│ Groups: ${data.groups ? '✅ ON' : '❌ OFF'}
│ Status: ${data.status ? '✅ ON' : '❌ OFF'}
│ This chat: ${data.chats[chatId] === true ? '✅ ON' : data.chats[chatId] === false ? '❌ OFF' : 'DEFAULT'}
│
│ Use *.chatbot usage* for commands.`
            ),
            message
        );
    } catch (error) {
        console.error('Chatbot command error:', error.message);
    }
}

function getOwnerInfoReply(userMessage) {
    const text = userMessage
        .toLowerCase()
        .replace(/[’']/g, "'")
        .trim();

    // Owner and creator questions
    const asksOwner =
        /\b(who (is|made|created|built|developed) you|who('?s| is) your (owner|creator|developer)|who (is|made|created|built|developed) (your )?(owner|creator|developer)|who brought you up|who owns you|your owner name|your developer name)\b/.test(text);

    // Owner contact questions
    const asksContact =
        /\b(contact|call|message|chat|reach|whatsapp|phone number|telephone|number)\b/.test(text) &&
        /\b(owner|developer|creator|chris|gaaju|him|her|you)\b/.test(text);

    // Deployment and repository questions
    const asksDeploy =
        /\b(deploy|deployment|host|hosting|fork|install|setup|set up)\b/.test(text) &&
        /\b(bot|gaaju|xmd|you|repository|repo|github|deploy|deployment|hosting)\b/.test(text);

    const asksTutorial =
        /\b(tutorial|video|guide)\b/.test(text) &&
        /\b(deploy|deployment|host|hosting|bot|gaaju|xmd)\b/.test(text);

    // Group questions
    const asksTestGroup =
        /\b(test group|testing group|bot test|test link|testing link)\b/.test(text);

    const asksOfficialGroup =
        /\b(official group|main group|official whatsapp group|official link)\b/.test(text);

    const asksGroup =
        /\b(group link|group invite|group invitation|send.*group|join.*group|whatsapp group)\b/.test(text);

    // Channel questions
    const asksBotChannel =
        /\b(bot channel|bot's channel|bots channel|bot official channel|official bot channel|bot updates channel|bot update channel|updates channel|update channel|channel for updates|channel of the bot|gaaju.?xmd channel|xmd channel|your channel|your official channel|official channel for the bot)\b/.test(text);

    const asksChrisChannel =
        /\b(chris('?s)? official channel|chris gaaju channel|chris gaaju official channel|developer('?s)? channel|owner('?s)? channel|owner official channel|developer official channel|creator('?s)? channel)\b/.test(text);

    const asksAnyChannel =
        /\b(channel|channels|whatsapp channel)\b/.test(text);

    if (asksOwner) {
        return `🤖 My owner and creator is *${OWNER_NAME}*! ❤️

He is my real developer and the person who created me and brought me to life. 🚀`;
    }

    if (asksContact) {
        return `📞 *CONTACT MY OWNER*

👑 Name: ${OWNER_NAME}
📱 WhatsApp: ${OWNER_NUMBER}

You can message my developer directly for help, questions, or support. ❤️`;
    }

    if (asksDeploy || asksTutorial) {
        return `🚀 *GAAJU-XMD DEPLOYMENT*

Want to deploy your own copy of GAAJU-XMD?

📂 *Fork the repository:*
${DEPLOY_REPO}

🎥 *Deployment tutorial:*
${DEPLOY_VIDEO}

Fork the repository first, then follow the video guide.`;
    }

    if (asksTestGroup) {
        return `🧪 *GAAJU-XMD BOT TEST GROUP*

Join the testing group here:
${TEST_GROUP}`;
    }

    if (asksOfficialGroup) {
        return `👥 *GAAJU-XMD OFFICIAL GROUP*

Join the official group here:
${OFFICIAL_GROUP}`;
    }

    if (asksGroup) {
        return `👥 *GAAJU-XMD GROUPS*

🧪 *Bot Test Group:*
${TEST_GROUP}

🌟 *Official Group:*
${OFFICIAL_GROUP}`;
    }

    // The bot's own official channel and updates channel
    if (asksBotChannel) {
        return `📢 *GAAJU-XMD OFFICIAL CHANNEL*

Follow the official GAAJU-XMD channel to receive bot updates and announcements. 🚀

🔗 *Bot Official Channel:*
${BOT_OFFICIAL_CHANNEL}

Stay connected so you don't miss updates! ❤️`;
    }

    // Chris Gaaju's personal official channel
    if (asksChrisChannel) {
        return `👑 *CHRIS GAAJU OFFICIAL CHANNEL*

Follow Chris Gaaju's official WhatsApp channel for updates and announcements. ❤️

🔗 *Chris Gaaju Official Channel:*
${CHRIS_OFFICIAL_CHANNEL}`;
    }

    // If the user asks generally about channels, provide both
    if (asksAnyChannel) {
        return `📢 *OFFICIAL WHATSAPP CHANNELS*

🤖 *GAAJU-XMD Bot Updates Channel:*
${BOT_OFFICIAL_CHANNEL}

👑 *Chris Gaaju Official Channel:*
${CHRIS_OFFICIAL_CHANNEL}

Follow the channels to stay connected and receive updates. ❤️`;
    }

    return null;
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

        // Answer known GAAJU-XMD questions before calling the AI.
        const infoReply = getOwnerInfoReply(userMessage);

        if (infoReply) {
            await sock.sendPresenceUpdate('composing', chatId);
            await sock.sendMessage(
                chatId,
                { text: infoReply },
                { quoted: message }
            );
            await sock.sendPresenceUpdate('paused', chatId);
            return;
        }

        // Keep the original AI chatbot behavior for other messages.
        const prompt = `You are a friendly WhatsApp user chatting casually. Be short, natural, use emojis. Match the vibe. Don't sound like AI, talk like a real person.

Message from ${chatId === 'status@broadcast' ? 'status' : isGroup ? 'group' : 'DM'}: ${userMessage}`;

        await sock.sendPresenceUpdate('composing', chatId);

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        await sock.sendPresenceUpdate('paused', chatId);

        const result = await response.json();
        const replyText = result.choices?.[0]?.message?.content;

        if (replyText && replyText.length > 2) {
            await sock.sendMessage(
                chatId,
                { text: replyText.trim() },
                { quoted: message }
            );
        }
    } catch (error) {
        console.error('Chatbot response error:', error.message);
    }
}

module.exports = {
    chatbotCommand,
    handleChatbotResponse
};
