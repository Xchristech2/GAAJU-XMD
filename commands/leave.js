/**
 * GAAJU-XMD - A WhatsApp Bot
 * Leave Command - Make bot leave groups immediately
 */

// Leave command
async function leaveCommand(sock, chatId, message) {
    try {
        // Check if it's a group
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text: '❌ This command only works in groups!',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406588763460@newsletter',
                        newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                        serverMessageId: -1
                    }
                }
            });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const groupName = groupMetadata.subject || 'Unknown Group';

        // Send leaving message
        await sock.sendMessage(chatId, {
            text: `👋 *Goodbye everyone!*\n\nI'm leaving this group now.\n\n*Group:* ${groupName}\n\nThanks for having me! 👋`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                    serverMessageId: -1
                }
            }
        });

        // Wait a moment then leave
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Leave the group
        await sock.groupLeave(chatId);

        console.log(`✅ Bot left group: ${groupName} (${chatId})`);

    } catch (error) {
        console.error('Error in leave command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to leave the group!',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                    serverMessageId: -1
                }
            }
        });
    }
}

module.exports = {
    leaveCommand
};
