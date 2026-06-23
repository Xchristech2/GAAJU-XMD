const fs = require('fs');
const path = require('path');

function isExactOwner(sock, userId, message) {
    try {
        const settings = require('../settings');
        const ownerNumber = settings.ownerNumber.replace(/[^0-9]/g, '');
        const userNumber = userId.split('@')[0].replace(/[^0-9]/g, '');
        const isOwner = userNumber === ownerNumber;
        const isBotSelf = message.key.fromMe;
        return isOwner || isBotSelf;
    } catch (error) {
        console.error('Error checking owner:', error);
        return false;
    }
}

function getOldSetting(settingKey) {
    try {
        const settingsPath = path.join(__dirname, '../settings.js');
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        const pattern = new RegExp(`${settingKey}:\\s*(['"]([^'"]*)['"]|[^,\\n}]+)`, 'i');
        const match = settingsContent.match(pattern);
        
        if (match && match[0]) {
            let value = match[0].replace(`${settingKey}:`, '').trim();
            if ((value.startsWith("'") && value.endsWith("'")) || 
                (value.startsWith('"') && value.endsWith('"'))) {
                value = value.substring(1, value.length - 1);
            }
            return value;
        }
        return 'Not set';
    } catch (error) {
        console.error(`Error getting ${settingKey}:`, error);
        return 'Error';
    }
}

function updateSettings(settingKey, settingValue) {
    let oldValue = 'Not set';
    
    try {
        const settingsPath = path.join(__dirname, '../settings.js');
        let settingsContent = fs.readFileSync(settingsPath, 'utf8');
        
        console.log(`Updating ${settingKey} to: ${settingValue}`);
        oldValue = getOldSetting(settingKey);
        
        let newValue;
        if (typeof settingValue === 'boolean') {
            newValue = settingValue;
        } else if (typeof settingValue === 'number') {
            newValue = settingValue;
        } else {
            newValue = `'${settingValue.replace(/'/g, "\\'")}'`;
        }
        
        const pattern = new RegExp(`(${settingKey}:\\s*)(['"][^'"]*['"]|[^,\\n}]+)`, 'i');
        
        if (settingsContent.match(pattern)) {
            settingsContent = settingsContent.replace(pattern, `$1${newValue}`);
            console.log(`Updated ${settingKey} from "${oldValue}" to "${settingValue}"`);
        } else {
            // Find where to add new setting (before module.exports or last })
            if (settingsContent.includes('module.exports')) {
                settingsContent = settingsContent.replace('module.exports = {', `  ${settingKey}: ${newValue},\nmodule.exports = {`);
            } else {
                const lastComma = settingsContent.lastIndexOf(',');
                settingsContent = settingsContent.substring(0, lastComma + 1) + 
                                 `\n  ${settingKey}: ${newValue}` + 
                                 settingsContent.substring(lastComma + 1);
            }
            console.log(`Added ${settingKey}: ${settingValue}`);
        }
        
        fs.writeFileSync(settingsPath, settingsContent, 'utf8');
        delete require.cache[require.resolve('../settings')];
        
        return { success: true, oldValue };
        
    } catch (error) {
        console.error(`Error updating ${settingKey}:`, error);
        return { success: false, oldValue };
    }
}

// Function to restart bot
function restartBot(delay = 3000) {
    console.log(`🔄 Bot will restart in ${delay/1000} seconds...`);
    setTimeout(() => {
        console.log('🔄 Restarting bot...');
        process.exit(1); // Exit with code 1 to trigger auto-restart
    }, delay);
}

async function setBotNameCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        if (!args || args.length === 0) {
            const current = getOldSetting('botName');
            await sock.sendMessage(chatId, { 
                text: `🤖 Current Bot Name: ${current}\n\nUsage: .setbotname <new name>\nExample: .setbotname GAAJU-XMD PRO\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newName = args.join(' ').trim();
        if (newName.length < 2) {
            await sock.sendMessage(chatId, { 
                text: '❌ Bot name must be at least 2 characters.' 
            }, { quoted: message });
            return;
        }
        
        const result = updateSettings('botName', newName);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ BOT NAME UPDATED!\n\n📛 Old: ${result.oldValue}\n📛 New: ${newName}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update bot name.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setBotNameCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating bot name.' 
        }, { quoted: message });
    }
}

async function setBotOwnerCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check if args exist BEFORE getting old value
        if (!args || args.length === 0) {
            // Just show usage without getting old value
            await sock.sendMessage(chatId, { 
                text: `👑 Set Bot Owner Name\n\nUsage: .setbotowner <new owner name>\nExample: .setbotowner Chris Gaaju Tech\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newOwner = args.join(' ').trim();
        
        // Check if user entered empty or just spaces
        if (newOwner.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid owner name.\nExample: .setbotowner Chris Gaaju Tech' 
            }, { quoted: message });
            return;
        }
        
        // Only get old value AFTER confirming we have new value
        const oldValue = getOldSetting('botOwner');
        const result = updateSettings('botOwner', newOwner);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ BOT OWNER UPDATED!\n\n👑 Old: ${oldValue}\n👑 New: ${newOwner}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update bot owner.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setBotOwnerCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating bot owner.' 
        }, { quoted: message });
    }
}
async function setOwnerNumberCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check args first
        if (!args || args.length === 0) {
            // Show current without trying to update
            const current = getOldSetting('ownerNumber');
            
            await sock.sendMessage(chatId, { 
                text: `📞 Current Owner Number: ${current}\n\nUsage: .setownernumber <2348069675806>\nExample: .setownernumber 2348069675806\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newNumber = args[0].replace(/[^0-9]/g, '');
        
        // Check if empty
        if (newNumber.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid phone number.\nExample: .setownernumber 2348069675806' 
            }, { quoted: message });
            return;
        }
        
        if (newNumber.length < 10) {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid number format. Use country code + number (minimum 10 digits)' 
            }, { quoted: message });
            return;
        }
        
        // Get old value
        const oldValue = getOldSetting('ownerNumber');
        const result = updateSettings('ownerNumber', newNumber);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ OWNER NUMBER UPDATED!\n\n📞 Old: ${oldValue}\n📞 New: ${newNumber}\n\n🔄 Bot will auto-restart in 5 seconds...` 
            }, { quoted: message });
            
            restartBot(5000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update owner number.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setOwnerNumberCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating owner number.' 
        }, { quoted: message });
    }
}
async function setYTChannelCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check if args exist first
        if (!args || args.length === 0) {
            // Show current value without trying to update
            let current = getOldSetting('ytChannel');
            // If not in settings, check global
            if (current === 'Not set' && global.ytch) {
                current = global.ytch;
            }
            
            await sock.sendMessage(chatId, { 
                text: `📺 Current YouTube Channel: ${current}\n\nUsage: .setytchannel <channel name>\nExample: .setytchannel Xchristech\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newYT = args.join(' ').trim();
        
        // Check if empty
        if (newYT.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid YouTube channel name.\nExample: .setytchannel Wally Jay Tech' 
            }, { quoted: message });
            return;
        }
        
        if (newYT.includes('youtube.com') || newYT.includes('youtu.be') || newYT.includes('http')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter channel NAME only, not YouTube link.\nExample: Xchristech' 
            }, { quoted: message });
            return;
        }
        
        // Get old value properly
        let oldValue = getOldSetting('ytChannel');
        if (oldValue === 'Not set' && global.ytch) {
            oldValue = global.ytch;
        }
        
        const result = updateSettings('ytChannel', newYT);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ YOUTUBE CHANNEL UPDATED!\n\n📺 Old: ${oldValue}\n📺 New: ${newYT}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update YouTube channel.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setYTChannelCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating YouTube channel.' 
        }, { quoted: message });
    }
}

async function setPackNameCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check args first
        if (!args || args.length === 0) {
            // Show current without trying to update
            let current = getOldSetting('packname');
            // Check global too
            if (current === 'Not set' && global.packname) {
                current = global.packname;
            }
            
            await sock.sendMessage(chatId, { 
                text: `📦 Current Pack Name: ${current}\n\nUsage: .setpackname <new pack name>\nExample: .setpackname GAAJU-XMD Stickers\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newPack = args.join(' ').trim();
        
        // Check if empty
        if (newPack.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid pack name.\nExample: .setpackname GAAJU-XMD Stickers' 
            }, { quoted: message });
            return;
        }
        
        // Get old value properly
        let oldValue = getOldSetting('packname');
        if (oldValue === 'Not set' && global.packname) {
            oldValue = global.packname;
        }
        
        const result = updateSettings('packname', newPack);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ PACK NAME UPDATED!\n\n📦 Old: ${oldValue}\n📦 New: ${newPack}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update pack name.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setPackNameCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating pack name.' 
        }, { quoted: message });
    }
}

async function setAuthorCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check args first
        if (!args || args.length === 0) {
            // Show current without trying to update
            let current = getOldSetting('author');
            // Check global too
            if (current === 'Not set' && global.author) {
                current = global.author;
            }
            
            await sock.sendMessage(chatId, { 
                text: `✍️ Current Author: ${current}\n\nUsage: .setauthor <new author name>\nExample: .setauthor Chris Gaaju\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newAuthor = args.join(' ').trim();
        
        // Check if empty
        if (newAuthor.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid author name.\nExample: .setauthor Chris Gaaju' 
            }, { quoted: message });
            return;
        }
        
        // Get old value properly
        let oldValue = getOldSetting('author');
        if (oldValue === 'Not set' && global.author) {
            oldValue = global.author;
        }
        
        const result = updateSettings('author', newAuthor);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ AUTHOR UPDATED!\n\n✍️ Old: ${oldValue}\n✍️ New: ${newAuthor}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update author.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setAuthorCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating author.' 
        }, { quoted: message });
    }
}

async function setTimezoneCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use this command.' 
            }, { quoted: message });
            return;
        }
        
        // FIXED: Check args first
        if (!args || args.length === 0) {
            // Show current without trying to update
            const current = getOldSetting('timezone');
            
            await sock.sendMessage(chatId, { 
                text: `🌍 Current Timezone: ${current}\n\nUsage: .settimezone <timezone>\nExample: .settimezone Africa/Lagos\n\n⚠️ Bot will auto-restart after update.` 
            }, { quoted: message });
            return;
        }
        
        const newTimezone = args.join(' ').trim();
        
        // Check if empty
        if (newTimezone.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid timezone.\nExample: .settimezone Africa/Lagos' 
            }, { quoted: message });
            return;
        }
        
        if (!newTimezone.includes('/')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid timezone format. Use: Continent/City\nExample: Africa/Lagos' 
            }, { quoted: message });
            return;
        }
        
        // Get old value
        const oldValue = getOldSetting('timezone');
        const result = updateSettings('timezone', newTimezone);
        
        if (result.success) {
            await sock.sendMessage(chatId, { 
                text: `✅ TIMEZONE UPDATED!\n\n🌍 Old: ${oldValue}\n🌍 New: ${newTimezone}\n\n🔄 Bot will auto-restart in 3 seconds...` 
            }, { quoted: message });
            
            restartBot(3000);
            
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to update timezone.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Error in setTimezoneCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error updating timezone.' 
        }, { quoted: message });
    }
}

async function configHelpCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        if (!isExactOwner(sock, senderId, message)) {
            await sock.sendMessage(chatId, { 
                text: '🚫 ACCESS DENIED!\n\nOnly the bot owner can use configuration commands.' 
            }, { quoted: message });
            return;
        }
        
        const helpText = `*🔧 WALLYJAYTECH-MD CONFIGURATION COMMANDS*

These commands modify settings.js file directly:

*🤖 Bot Identity:*
• .setbotname <name> - Change bot display name
• .setbotowner <name> - Change owner display name
• .setownernumber <num> - Change owner WhatsApp number

*📺 Medias:*
• .setytchannel <name> - Change YouTube channel NAME
• .setpackname <name> - Change sticker pack name
• .setauthor <name> - Change sticker author name

*🌍 Preferences:*
• .settimezone <zone> - Change bot timezone

*⚠️ IMPORTANT:*
• ALL commands auto-restart the bot after update
• Only the owner number can use these commands
• Changes are saved to settings.js
• No sudo users can access these commands`;
        
        await sock.sendMessage(chatId, { 
            text: helpText
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in configHelpCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error loading help.' 
        }, { quoted: message });
    }
}

module.exports = {
    setBotNameCommand,
    setBotOwnerCommand,
    setOwnerNumberCommand,
    setYTChannelCommand,
    setPackNameCommand,
    setAuthorCommand,
    setTimezoneCommand,
    configHelpCommand
};
