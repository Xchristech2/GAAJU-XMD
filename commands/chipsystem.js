const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// File paths
const CHIPS_FILE = './data/chips.json';
const OWNER_FILE = './data/owner.json';
const SETTINGS_FILE = './settings.js';


const packageJson = require('../package.json');
const OWNER_PASSWORD = packageJson.build.number.toString();

// Load or initialize data
function loadData(file, defaultValue = {}) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
    return defaultValue;
}

function saveData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error saving ${file}:`, error);
    }
}

// Get settings
function getSettings() {
    try {
        return require('../settings');
    } catch (error) {
        return {
            ownerNumber: '2348069675806',
            botOwner: 'ᴄʜʀɪs ɢᴀᴀᴊᴜ'
        };
    }
}

// Check if user is owner
async function isOwner(sock, userId) {
    try {
        const settings = getSettings();
        const ownerId = settings.ownerNumber.includes('@') 
            ? settings.ownerNumber 
            : `${settings.ownerNumber}@s.whatsapp.net`;
        
        return userId === ownerId || userId === sock.user.id;
    } catch (error) {
        return false;
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Verify password
function verifyPassword(inputPassword) {
    return inputPassword === packageJson.build.number.toString();
}

// Verify password
function verifyPassword(inputPassword) {
    return inputPassword === OWNER_PASSWORD;
}

// Get user ID from message
function getUserId(message) {
    return message.key.participant || message.key.remoteJid;
}

// Get user chips
function getUserChips(userId) {
    const chipsData = loadData(CHIPS_FILE, {});
    if (!chipsData[userId]) {
        chipsData[userId] = {
            chips: 1000, // Starting chips
            lastDaily: null,
            totalWon: 0,
            totalLost: 0,
            chipsBought: 0,
            chipsReceived: 0
        };
        saveData(CHIPS_FILE, chipsData);
    }
    return chipsData[userId].chips;
}

// Update user chips
function updateUserChips(userId, amount, reason = 'admin') {
    const chipsData = loadData(CHIPS_FILE, {});
    
    if (!chipsData[userId]) {
        chipsData[userId] = {
            chips: 1000,
            lastDaily: null,
            totalWon: 0,
            totalLost: 0,
            chipsBought: 0,
            chipsReceived: 0
        };
    }
    
    // Track chip transactions
    if (reason === 'purchase') {
        chipsData[userId].chipsBought = (chipsData[userId].chipsBought || 0) + amount;
    } else if (reason === 'admin') {
        chipsData[userId].chipsReceived = (chipsData[userId].chipsReceived || 0) + amount;
    }
    
    chipsData[userId].chips += amount;
    
    // Ensure chips don't go negative
    if (chipsData[userId].chips < 0) {
        chipsData[userId].chips = 0;
    }
    
    saveData(CHIPS_FILE, chipsData);
    return chipsData[userId].chips;
}

// Get user info from number
async function getUserInfo(sock, userNumber) {
    try {
        // Clean number format
        let cleanNumber = userNumber.replace(/[^0-9]/g, '');
        
        // Add country code if missing (assuming Nigeria +234)
        if (!cleanNumber.startsWith('234') && cleanNumber.length === 10) {
            cleanNumber = '234' + cleanNumber.slice(1);
        }
        
        const jid = `${cleanNumber}@s.whatsapp.net`;
        
        // Try to get contact info
        const contact = await sock.getContact(jid).catch(() => null);
        
        return {
            jid: jid,
            number: cleanNumber,
            name: contact?.notify || contact?.name || `User (${cleanNumber})`,
            exists: contact ? true : false
        };
    } catch (error) {
        return {
            jid: `${userNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`,
            number: userNumber.replace(/[^0-9]/g, ''),
            name: `User (${userNumber})`,
            exists: false
        };
    }
}

// OWNER COMMAND 1: Unlimited Chips
async function unlimitedChipsCommand(sock, chatId, message, args) {
    try {
        const userId = getUserId(message);
        const isOwnerUser = await isOwner(sock, userId);
        
        if (!isOwnerUser) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only for the bot owner!' 
            }, { quoted: message });
            return;
        }
        
        // Check for password
        if (args.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '🔐 *UNLIMITED CHIPS*\n\nPlease enter password:\n`.unlimitedchips [password]`\n\nExample: `.unlimitedchips admin123`' 
            }, { quoted: message });
            return;
        }
        
        const password = args[0];
        
        if (!verifyPassword(password)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Incorrect password! Access denied.' 
            }, { quoted: message });
            return;
        }
        
        // Give unlimited chips (1,000,000 chips)
        const unlimitedAmount = 1000000;
        const newBalance = updateUserChips(userId, unlimitedAmount, 'admin');
        
        await sock.sendMessage(chatId, { 
            text: `🎉 *UNLIMITED CHIPS ACTIVATED!*\n\n💰 +${formatNumber(unlimitedAmount)} chips added!\n\nNew Balance: 💰 ${formatNumber(newBalance)} chips\n\nYou now have unlimited chips to test the bot!` 
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in unlimitedchips command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error processing command.' 
        }, { quoted: message });
    }
}

// USER COMMAND: Buy Chips
async function buyChipsCommand(sock, chatId, message) {
    try {
        const settings = getSettings();
        const ownerNumber = settings.ownerNumber;
        const ownerName = settings.botOwner || 'Bot Owner';
        
        // Create clickable WhatsApp link
        const whatsappLink = `https://wa.me/${ownerNumber}`;
        
        // Pricing information
        const response = `💰 *BUY CHIPS - PREMIUM PACKAGES* 💰\n\n` +
            `*Contact Owner:*\n` +
            `👑 ${ownerName}\n` +
            `📞 +${ownerNumber}\n` +
            `🔗 ${whatsappLink}\n\n` +
            
            `*Chip Packages:*\n` +
            `🎁 *Starter Pack:* 5,000 chips - ₦500 / $1\n` +
            `🏆 *Pro Pack:* 25,000 chips - ₦2,000 / $4\n` +
            `👑 *VIP Pack:* 100,000 chips - ₦5,000 / $10\n` +
            `💎 *Ultimate Pack:* 1,000,000 chips - ₦20,000 / $40\n\n` +
            
            `*How to Buy:*\n` +
            `1. Message the owner using the link above\n` +
            `2. Specify which package you want\n` +
            `3. Make payment\n` +
            `4. Owner will add chips to your account\n\n` +
            
            `*Payment Methods:*\n` +
            `• Bank Transfer (Nigeria)\n` +
            `• PayPal\n` +
            `• Cryptocurrency (BTC, USDT)\n` +
            `• Mobile Money\n\n` +
            
            `*Note:* Once payment is confirmed, chips will be added instantly!`;
        
        await sock.sendMessage(chatId, { 
            text: response 
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in buychips command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error fetching purchase information.' 
        }, { quoted: message });
    }
}

// OWNER COMMAND 2: Add Chips to User
async function addChipsCommand(sock, chatId, message, args) {
    try {
        const userId = getUserId(message);
        const isOwnerUser = await isOwner(sock, userId);
        
        if (!isOwnerUser) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only for the bot owner!' 
            }, { quoted: message });
            return;
        }
        
        // Check for password
        if (args.length < 3) {
            await sock.sendMessage(chatId, { 
                text: '🔐 *ADD CHIPS TO USER*\n\nUsage:\n`.addchips [password] [user-number] [amount]`\n\nExample:\n`.addchips admin123 2348069675806 5000`\n\nThis will add 5,000 chips to user 2348069675806' 
            }, { quoted: message });
            return;
        }
        
        const password = args[0];
        const userNumber = args[1];
        const amount = parseInt(args[2]);
        
        if (!verifyPassword(password)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Incorrect password! Access denied.' 
            }, { quoted: message });
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid chip amount (positive number).' 
            }, { quoted: message });
            return;
        }
        
        if (amount > 10000000) {
            await sock.sendMessage(chatId, { 
                text: '❌ Maximum chip addition is 10,000,000 at once.' 
            }, { quoted: message });
            return;
        }
        
        // Get user info
        const userInfo = await getUserInfo(sock, userNumber);
        
        // Add chips to user
        const newBalance = updateUserChips(userInfo.jid, amount, 'purchase');
        
        // Create transaction record
        const transaction = {
            date: new Date().toISOString(),
            from: 'owner',
            to: userInfo.jid,
            amount: amount,
            newBalance: newBalance
        };
        
        // Save transaction log
        const transactions = loadData('./data/transactions.json', []);
        transactions.push(transaction);
        saveData('./data/transactions.json', transactions);
        
        // Notify owner
        const ownerMessage = `✅ *CHIPS ADDED SUCCESSFULLY!*\n\n` +
            `👤 *User:* ${userInfo.name}\n` +
            `📞 *Number:* ${userInfo.number}\n` +
            `💰 *Amount Added:* ${formatNumber(amount)} chips\n` +
            `💵 *New Balance:* ${formatNumber(newBalance)} chips\n\n` +
            `⏰ *Time:* ${moment().tz(getSettings().timezone || 'Africa/Lagos').format('YYYY-MM-DD HH:mm:ss')}\n` +
            `📝 *Transaction ID:* TX${Date.now()}`;
        
        await sock.sendMessage(chatId, { 
            text: ownerMessage 
        }, { quoted: message });
        
        // Try to notify user (if they're in a chat with bot)
        try {
            const userMessage = `🎉 *CHIPS RECEIVED!* 🎉\n\n` +
                `💰 *Amount:* +${formatNumber(amount)} chips\n` +
                `💵 *New Balance:* ${formatNumber(newBalance)} chips\n\n` +
                `Thank you for your purchase! Enjoy playing! 🎮\n\n` +
                `Use \`.coinstats\` to check your balance.`;
            
            await sock.sendMessage(userInfo.jid, { 
                text: userMessage 
            });
        } catch (userError) {
            console.log(`User ${userInfo.number} might not have chatted with bot.`);
        }
        
    } catch (error) {
        console.error('Error in addchips command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error adding chips. Please check the user number and try again.' 
        }, { quoted: message });
    }
}

// OWNER COMMAND 3: Check User Balance
async function checkBalanceCommand(sock, chatId, message, args) {
    try {
        const userId = getUserId(message);
        const isOwnerUser = await isOwner(sock, userId);
        
        if (!isOwnerUser) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only for the bot owner!' 
            }, { quoted: message });
            return;
        }
        
        // Check for password
        if (args.length < 2) {
            await sock.sendMessage(chatId, { 
                text: '🔐 *CHECK USER BALANCE*\n\nUsage:\n`.checkbalance [password] [user-number]`\n\nExample:\n`.checkbalance admin123 2348069675806`' 
            }, { quoted: message });
            return;
        }
        
        const password = args[0];
        const userNumber = args[1];
        
        if (!verifyPassword(password)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Incorrect password! Access denied.' 
            }, { quoted: message });
            return;
        }
        
        // Get user info
        const userInfo = await getUserInfo(sock, userNumber);
        const userChips = getUserChips(userInfo.jid);
        
        const response = `📊 *USER BALANCE REPORT*\n\n` +
            `👤 *User:* ${userInfo.name}\n` +
            `📞 *Number:* ${userInfo.number}\n` +
            `🆔 *JID:* ${userInfo.jid}\n` +
            `💰 *Chip Balance:* ${formatNumber(userChips)}\n` +
            `📅 *Account Exists:* ${userInfo.exists ? '✅ Yes' : '⚠️ Not in contacts'}\n\n` +
            `*Last Updated:* ${moment().tz(getSettings().timezone || 'Africa/Lagos').format('YYYY-MM-DD HH:mm:ss')}`;
        
        await sock.sendMessage(chatId, { 
            text: response 
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in checkbalance command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error checking user balance.' 
        }, { quoted: message });
    }
}

// OWNER COMMAND 4: Reset User Chips
async function resetChipsCommand(sock, chatId, message, args) {
    try {
        const userId = getUserId(message);
        const isOwnerUser = await isOwner(sock, userId);
        
        if (!isOwnerUser) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only for the bot owner!' 
            }, { quoted: message });
            return;
        }
        
        // Check for password
        if (args.length < 3) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ *RESET USER CHIPS*\n\nUsage:\n`.resetchips [password] [user-number] [new-amount]`\n\nExample:\n`.resetchips admin123 2348069675806 1000`\n\n*Warning:* This will completely reset user chips to the specified amount!' 
            }, { quoted: message });
            return;
        }
        
        const password = args[0];
        const userNumber = args[1];
        const newAmount = parseInt(args[2]);
        
        if (!verifyPassword(password)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Incorrect password! Access denied.' 
            }, { quoted: message });
            return;
        }
        
        if (isNaN(newAmount) || newAmount < 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please enter a valid chip amount (0 or more).' 
            }, { quoted: message });
            return;
        }
        
        // Get user info
        const userInfo = await getUserInfo(sock, userNumber);
        const chipsData = loadData(CHIPS_FILE, {});
        
        // Reset chips
        if (!chipsData[userInfo.jid]) {
            chipsData[userInfo.jid] = {
                chips: 1000,
                lastDaily: null,
                totalWon: 0,
                totalLost: 0,
                chipsBought: 0,
                chipsReceived: 0
            };
        }
        
        const oldBalance = chipsData[userInfo.jid].chips;
        chipsData[userInfo.jid].chips = newAmount;
        
        saveData(CHIPS_FILE, chipsData);
        
        const response = `🔄 *USER CHIPS RESET*\n\n` +
            `👤 *User:* ${userInfo.name}\n` +
            `📞 *Number:* ${userInfo.number}\n` +
            `💰 *Old Balance:* ${formatNumber(oldBalance)} chips\n` +
            `💰 *New Balance:* ${formatNumber(newAmount)} chips\n` +
            `📉 *Change:* ${formatNumber(newAmount - oldBalance)} chips\n\n` +
            `*Reset Time:* ${moment().tz(getSettings().timezone || 'Africa/Lagos').format('YYYY-MM-DD HH:mm:ss')}\n` +
            `⚠️ *Note:* User statistics remain unchanged.`;
        
        await sock.sendMessage(chatId, { 
            text: response 
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in resetchips command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error resetting user chips.' 
        }, { quoted: message });
    }
}

// OWNER COMMAND 5: View All Transactions
async function viewTransactionsCommand(sock, chatId, message, args) {
    try {
        const userId = getUserId(message);
        const isOwnerUser = await isOwner(sock, userId);
        
        if (!isOwnerUser) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only for the bot owner!' 
            }, { quoted: message });
            return;
        }
        
        // Check for password
        if (args.length < 1) {
            await sock.sendMessage(chatId, { 
                text: '🔐 *VIEW TRANSACTIONS*\n\nUsage:\n`.transactions [password]`\n\nExample:\n`.transactions admin123`' 
            }, { quoted: message });
            return;
        }
        
        const password = args[0];
        
        if (!verifyPassword(password)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Incorrect password! Access denied.' 
            }, { quoted: message });
            return;
        }
        
        const transactions = loadData('./data/transactions.json', []);
        
        if (transactions.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '📋 *TRANSACTION HISTORY*\n\nNo transactions found yet.' 
            }, { quoted: message });
            return;
        }
        
        // Show last 10 transactions
        const recentTransactions = transactions.slice(-10).reverse();
        
        let response = `📋 *RECENT TRANSACTIONS* (Last 10)\n\n`;
        let totalChips = 0;
        
        recentTransactions.forEach((tx, index) => {
            const date = moment(tx.date).tz(getSettings().timezone || 'Africa/Lagos').format('YYYY-MM-DD HH:mm:ss');
            const shortJid = tx.to.split('@')[0];
            
            response += `${index + 1}. ${date}\n`;
            response += `   👤 ${shortJid}\n`;
            response += `   💰 +${formatNumber(tx.amount)} chips\n`;
            response += `   💵 New: ${formatNumber(tx.newBalance)} chips\n`;
            response += `   ─────────────────\n`;
            
            totalChips += tx.amount;
        });
        
        response += `\n📊 *SUMMARY*\n`;
        response += `Total Transactions: ${transactions.length}\n`;
        response += `Total Chips Distributed: ${formatNumber(totalChips)}\n`;
        response += `\nUse \`.transactions all [password]\` for full list`;
        
        await sock.sendMessage(chatId, { 
            text: response 
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in transactions command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error fetching transactions.' 
        }, { quoted: message });
    }
}

// Export all commands
module.exports = {
    unlimitedChipsCommand,
    buyChipsCommand,
    addChipsCommand,
    checkBalanceCommand,
    resetChipsCommand,
    viewTransactionsCommand
};
