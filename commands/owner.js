 const settings = require('../settings');

async function ownerCommand(sock, chatId, message) {
    try {
        // HARDCODED - CANNOT BE CHANGED BY DEPLOYERS
        const ORIGINAL_CREATOR = {
            name: "Chris Gaaju",
            number: "2348069675806", 
            social: {
                youtube: "youtube.com/@Xchristech",
                github: "github.com/Xchristech2"
            }
        };

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ORIGINAL_CREATOR.name}
ORG:Chris Gaaju;
TITLE:Original Bot Developer
TEL;waid=${ORIGINAL_CREATOR.number}:+${ORIGINAL_CREATOR.number}
NOTE:© 2026 Chris Gaaju. Original creator.
END:VCARD`;

        await sock.sendMessage(chatId, {
            contacts: {
                displayName: `Original Developer`,
                contacts: [{ vcard }]
            }
        });

        await sock.sendMessage(chatId, {
            text: `🔐 *ORIGINAL DEVELOPER CONTACT* 🔐

*👨‍💻 Original Creator:* ${ORIGINAL_CREATOR.name}
*📞 Official Contact:* +${ORIGINAL_CREATOR.number}
*🤖 Original Bot:* ${settings.botName}

⭐ *This bot was originally developed by Xchris Tech*
⭐ *Contact above number for genuine support*

🚫 *This bot might be deployed by someone else*
🚫 *But only the original developer can provide real support*

🌐 *Official Sources:*
📹 ${ORIGINAL_CREATOR.social.youtube}
🐙 ${ORIGINAL_CREATOR.social.github}

*© 2026 GAAJU-XMD - All Rights Reserved*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        // Ultimate fallback - completely hardcoded
        await sock.sendMessage(chatId, {
            text: `👑 *ORIGINAL BOT DEVELOPER* 👑

*Chris Gaaju - GAAJU-XMD*
*Official WhatsApp:* +2348069675806

*This bot was originally created by Chris Gaaju*
*Contact the original developer for real support*

⚠️ *This may be a deployed copy by someone else*
⚠️ *Only original developer can provide updates*`
        }, { quoted: message });
    }
}

module.exports = ownerCommand;
