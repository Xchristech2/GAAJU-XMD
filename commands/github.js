const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const REPO_URL = 'https://github.com/Xchristech2/GAAJU-XMD';
const API_URL = 'https://api.github.com/repos/Xchristech2/GAAJU-XMD';
const TUTORIAL_URL = 'https://youtu.be/JV4vcawI6fI';

async function githubCommand(sock, chatId, message) {
    try {
        await sock.sendPresenceUpdate('composing', chatId);

        const res = await fetch(API_URL, {
            headers: {
                'User-Agent': 'GAAJU-XMD'
            }
        });

        if (!res.ok) {
            throw new Error(`GitHub API returned ${res.status}`);
        }

        const repo = await res.json();

        const updated = repo.updated_at
            ? new Date(repo.updated_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            : 'Unknown';

        const txt = `╭━━〔 🐙 *GAAJU-XMD* 〕
┃
┃ ⤷ *Repository:* ${repo.name || 'GAAJU-XMD'}
┃ ⤷ *Description:* ${repo.description || 'Multi-Device WhatsApp Bot'}
┃ ⤷ *Language:* ${repo.language || 'JavaScript'}
┃ ⤷ *Branch:* ${repo.default_branch || 'main'}
┃ ⤷ *Stars:* ${repo.stargazers_count?.toLocaleString() || '0'} ⭐
┃ ⤷ *Forks:* ${repo.forks_count?.toLocaleString() || '0'} 🔀
┃ ⤷ *Issues:* ${repo.open_issues_count?.toLocaleString() || '0'} 🐛
┃ ⤷ *Updated:* ${updated}
┃
╰━━━━━━━━━━━━━━

╭━━〔 🔗 *LINKS* 〕
┃
┃ ⤷ *Repository:*
┃ ${REPO_URL}
┃
┃ ⤷ *Deployment Tutorial:*
┃ ${TUTORIAL_URL}
┃
╰━━━━━━━━━━━━━━`;

        const imgPath = path.join(__dirname, '../assets/bot_image.jpg');

        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406588763460@newsletter',
                newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                serverMessageId: -1
            }
        };

        if (fs.existsSync(imgPath)) {
            const imageBuffer = fs.readFileSync(imgPath);

            await sock.sendMessage(
                chatId,
                {
                    image: imageBuffer,
                    caption: txt,
                    contextInfo
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(
                chatId,
                {
                    text: txt,
                    contextInfo
                },
                { quoted: message }
            );
        }

        console.log('✅ GAAJU-XMD GitHub info sent');

    } catch (error) {
        console.error('❌ GitHub command error:', error);

        await sock.sendMessage(
            chatId,
            {
                text: `❌ *GITHUB ERROR*\n\nUnable to fetch the repository right now.\n\n🔗 ${REPO_URL}`
            },
            { quoted: message }
        );
    }
}

module.exports = githubCommand;
