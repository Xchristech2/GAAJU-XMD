  const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

// Path to store bad words list and group settings
const BAD_WORDS_FILE = './data/badwords.json';
const ANTIBADWORD_SETTINGS = './data/antibadword_settings.json';

// Ensure data directory exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
}

// Initialize files if they don't exist
function initializeFiles() {
    if (!fs.existsSync(BAD_WORDS_FILE)) {
        fs.writeFileSync(BAD_WORDS_FILE, JSON.stringify({
            global: [],
            groups: {}
        }, null, 2));
    }

    if (!fs.existsSync(ANTIBADWORD_SETTINGS)) {
        fs.writeFileSync(ANTIBADWORD_SETTINGS, JSON.stringify({}, null, 2));
    }
}

// Load bad words data
function loadBadWords() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(BAD_WORDS_FILE));
    } catch (error) {
        console.error('Error loading bad words:', error);
        return { global: [], groups: {} };
    }
}

// Save bad words data
function saveBadWords(data) {
    try {
        fs.writeFileSync(BAD_WORDS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving bad words:', error);
        return false;
    }
}

// Load antibadword settings
function loadSettings() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(ANTIBADWORD_SETTINGS));
    } catch (error) {
        console.error('Error loading antibadword settings:', error);
        return {};
    }
}

// Save antibadword settings
function saveSettings(settings) {
    try {
        fs.writeFileSync(ANTIBADWORD_SETTINGS, JSON.stringify(settings, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving antibadword settings:', error);
        return false;
    }
}

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
    try {
        // CRITICAL: Check if user is group admin - NO SUDO, NO PUBLIC
        const { isSenderAdmin: userIsAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        
        if (!userIsAdmin && !message.key.fromMe) {
            await sock.sendMessage(chatId, {
                text: '*❌ Only group admins can use antibadword commands.*',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406588763460@newsletter',
                        newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
            return;
        }

        // Check if bot is admin (required for antibadword to work properly)
        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text: '*❌ Please make the bot an admin to use antibadword features.*',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406588763460@newsletter',
                        newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
            return;
        }

        const userMessage = message.message?.conversation ||
                          message.message?.extendedTextMessage?.text || '';
        const args = userMessage.split(' ').slice(1);
        const command = args[0]?.toLowerCase();

        if (!command) {
            // Show antibadword help
            await showAntibadwordHelp(sock, chatId, message);
            return;
        }

        switch (command) {
            case 'on':
                await enableAntibadword(sock, chatId, message);
                break;
            case 'off':
                await disableAntibadword(sock, chatId, message);
                break;
            case 'add':
                await addBadWord(sock, chatId, message, args.slice(1));
                break;
            case 'remove':
                await removeBadWord(sock, chatId, message, args.slice(1));
                break;
            case 'list':
                await listBadWords(sock, chatId, message);
                break;
            case 'clear':
                await clearBadWords(sock, chatId, message);
                break;
            case 'status':
                await showStatus(sock, chatId, message);
                break;
            default:
                await sock.sendMessage(chatId, {
                    text: '*❌ Invalid Command*\n\nUse *.antibadword* to see available commands.',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363406588763460@newsletter',
                            newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                            serverMessageId: -1
                        }
                    }
                }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in antibadword command:', error);
        await sock.sendMessage(chatId, {
            text: '*❌ Error processing antibadword command*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function showAntibadwordHelp(sock, chatId, message) {
    const helpText = `*🚫 ANTIBADWORD SYSTEM*

*Commands:*
• *.antibadword on* - Enable bad word filtering
• *.antibadword off* - Disable bad word filtering
• *.antibadword add <word>* - Add a bad word
• *.antibadword remove <word>* - Remove a bad word
• *.antibadword list* - Show all bad words
• *.antibadword clear* - Clear all bad words
• *.antibadword status* - Show current status

*Examples:*
• *.antibadword add fuck*
• *.antibadword remove shit*
• *.antibadword list*

*Note:* Only group admins can manage antibadword settings.`;

    await sock.sendMessage(chatId, {
        text: helpText,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                serverMessageId: -1
            }
        }
    }, { quoted: message });
}

async function enableAntibadword(sock, chatId, message) {
    const settings = loadSettings();
    settings[chatId] = settings[chatId] || {};
    settings[chatId].enabled = true;

    if (saveSettings(settings)) {
        await sock.sendMessage(chatId, {
            text: '*✅ Antibadword system enabled!*\n\nBad words will now be automatically filtered.',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to enable antibadword*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function disableAntibadword(sock, chatId, message) {
    const settings = loadSettings();
    settings[chatId] = settings[chatId] || {};
    settings[chatId].enabled = false;

    if (saveSettings(settings)) {
        await sock.sendMessage(chatId, {
            text: '*✅ Antibadword system disabled!*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to disable antibadword*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function addBadWord(sock, chatId, message, words) {
    if (words.length === 0) {
        await sock.sendMessage(chatId, {
            text: '*❌ Please specify words to add.*\n\nExample: *.antibadword add fuck shit*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        return;
    }

    const badWordsData = loadBadWords();
    badWordsData.groups[chatId] = badWordsData.groups[chatId] || [];

    let addedWords = [];
    let skippedWords = [];

    words.forEach(word => {
        const cleanWord = word.toLowerCase().trim();
        if (cleanWord && !badWordsData.groups[chatId].includes(cleanWord)) {
            badWordsData.groups[chatId].push(cleanWord);
            addedWords.push(cleanWord);
        } else {
            skippedWords.push(cleanWord);
        }
    });

    if (saveBadWords(badWordsData)) {
        let response = '';
        if (addedWords.length > 0) {
            response += `*✅ Added words:* ${addedWords.join(', ')}\n`;
        }
        if (skippedWords.length > 0) {
            response += `*⚠️ Skipped (already exists):* ${skippedWords.join(', ')}\n`;
        }

        await sock.sendMessage(chatId, {
            text: response,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to add bad words*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function removeBadWord(sock, chatId, message, words) {
    if (words.length === 0) {
        await sock.sendMessage(chatId, {
            text: '*❌ Please specify words to remove.*\n\nExample: *.antibadword remove fuck*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        return;
    }

    const badWordsData = loadBadWords();
    if (!badWordsData.groups[chatId] || badWordsData.groups[chatId].length === 0) {
        await sock.sendMessage(chatId, {
            text: '*ℹ️ No bad words found for this group.*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        return;
    }

    let removedWords = [];
    let notFoundWords = [];

    words.forEach(word => {
        const cleanWord = word.toLowerCase().trim();
        const index = badWordsData.groups[chatId].indexOf(cleanWord);
        if (index > -1) {
            badWordsData.groups[chatId].splice(index, 1);
            removedWords.push(cleanWord);
        } else {
            notFoundWords.push(cleanWord);
        }
    });

    if (saveBadWords(badWordsData)) {
        let response = '';
        if (removedWords.length > 0) {
            response += `*✅ Removed words:* ${removedWords.join(', ')}\n`;
        }
        if (notFoundWords.length > 0) {
            response += `*⚠️ Not found:* ${notFoundWords.join(', ')}\n`;
        }

        await sock.sendMessage(chatId, {
            text: response,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to remove bad words*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function listBadWords(sock, chatId, message) {
    const badWordsData = loadBadWords();
    const groupWords = badWordsData.groups[chatId] || [];
    const globalWords = badWordsData.global || [];

    if (groupWords.length === 0 && globalWords.length === 0) {
        await sock.sendMessage(chatId, {
            text: '*ℹ️ No bad words configured for this group.*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        return;
    }

    let response = '*🚫 BAD WORDS LIST*\n\n';

    if (globalWords.length > 0) {
        response += `*Global Words (${globalWords.length}):*\n${globalWords.join(', ')}\n\n`;
    }

    if (groupWords.length > 0) {
        response += `*Group Words (${groupWords.length}):*\n${groupWords.join(', ')}`;
    }

    // Split message if too long
    if (response.length > 4096) {
        response = '*🚫 BAD WORDS LIST*\n\nToo many words to display. Use *.antibadword remove* to manage them.';
    }

    await sock.sendMessage(chatId, {
        text: response,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                serverMessageId: -1
            }
        }
    }, { quoted: message });
}

async function clearBadWords(sock, chatId, message) {
    const badWordsData = loadBadWords();
    const groupWordsCount = badWordsData.groups[chatId] ? badWordsData.groups[chatId].length : 0;

    delete badWordsData.groups[chatId];

    if (saveBadWords(badWordsData)) {
        await sock.sendMessage(chatId, {
            text: `*✅ Cleared ${groupWordsCount} bad words from this group.*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to clear bad words*',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

async function showStatus(sock, chatId, message) {
    const settings = loadSettings();
    const badWordsData = loadBadWords();

    const isEnabled = settings[chatId]?.enabled || false;
    const groupWordsCount = badWordsData.groups[chatId] ? badWordsData.groups[chatId].length : 0;
    const globalWordsCount = badWordsData.global.length;

    const status = isEnabled ? '🟢 ENABLED' : '🔴 DISABLED';

    await sock.sendMessage(chatId, {
        text: `*🚫 ANTIBADWORD STATUS*\n\n*Status:* ${status}\n*Group Words:* ${groupWordsCount}\n*Global Words:* ${globalWordsCount}\n\nUse *.antibadword* for commands.`,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: 'ɢᴀᴀᴊᴜ-xᴍᴅ',
                serverMessageId: -1
            }
        }
    }, { quoted: message });
}

module.exports = antibadwordCommand;
