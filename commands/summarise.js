//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
// //
// 𝐖𝐀𝐋𝐋𝐘𝐉𝐀𝐘𝐓𝐄𝐂𝐇-𝐌𝐃 𝐁𝐎𝐓 //
// //
// 𝐕 : 1.0.0 //
// //
// //
// ██╗ ██╗ █████╗ ██╗ ██╗ ██╗ ██╗ ██╗ █████╗ ██╗ ██╗████████╗███████╗ ██████╗██╗ ██╗ ███╗ ███╗██████╗ //
// ██║ ██║██╔══██╗██║ ██║ ╚██╗ ██╔╝ ██║██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝██╔════╝██║ ██║ ████╗ ████║██╔══██╗ //
// ██║ █╗ ██║███████║██║ ██║ ╚████╔╝ ██║███████║ ╚████╔╝ ██║ █████╗ ██║ ███████║█████╗██╔████╔██║██║ ██║ //
// ██║███╗██║██╔══██║██║ ██║ ╚██╔╝██ ██║██╔══██║ ╚██╔╝ ██║ ██╔══╝ ██║ ██╔══██║╚════╝██║╚██╔╝██║██║ ██║ //
// ╚███╔███╔╝██║ ██║███████╗███████╗██║ ╚█████╔╝██║ ██║ ██║ ██║ ███████╗╚██████╗██║ ██║ ██║ ╚═╝ ██║██████╔╝ //
// ╚══╝╚══╝ ╚═╝ ╚═╝╚══════╝╚══════╝╚═╝ ╚════╝ ╚═╝ ╚═╝ ╚═╝ ╚═╝ ╚══════╝ ╚═════╝╚═╝ ╚═╝ ╚═╝ ╚═╝╚═════╝ //
// //
// 𝐂𝐎𝐏𝐘𝐑𝐈𝐆𝐇𝐓 2025 //
// //
// //
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
/*
• GAAJU-XMD - Text Summariser (.summarise)
• Powered by Pollinations GPT — Free
• Features: Reply/Type | Media captions | Animation | Smart short text
• Professional Version
*/

const fetch = require('node-fetch');

const LOADING_FRAMES = [
'Summarising [■□□□□□□□□□]',
'Summarising [■■□□□□□□□□]',
'Summarising [■■■□□□□□□□]',
'Summarising [■■■■□□□□□□]',
'Summarising [■■■■■□□□□□]',
'Summarising [■■■■■■□□□□]',
'Summarising [■■■■■■■□□□]',
'Summarising [■■■■■■■■□□]',
'Summarising [■■■■■■■■■□]'
];

function wrapText(text, maxLen = 30) {
const words = text.split(' ');
const lines = [];
let current = '';
for (const word of words) {
if ((current + word).length > maxLen && current.length > 0) {
lines.push(current.trim());
current = word;
} else {
current += (current ? ' ' : '') + word;
}
}
if (current) lines.push(current.trim());
return lines;
}

async function summariseCommand(sock, chatId, message) {
let loadingMsg;

try {
const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
const userText = text.split(' ').slice(1).join(' ').trim();

const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
let textToSummarise = '';

if (quotedMessage) {
textToSummarise = quotedMessage.conversation ||
quotedMessage.extendedTextMessage?.text ||
quotedMessage.imageMessage?.caption ||
quotedMessage.videoMessage?.caption || '';
}

if (!textToSummarise && userText) {
textToSummarise = userText;
}

if (!textToSummarise) {
  return sock.sendMessage(chatId, {
    text: `╭──◆「 *SUMMARISE* 」◆
├
├◇ 📝 Summarise any text
├◇ 🆓 Powered by Pollinations
├
├◇ *📖 Usage:*
├ └ Reply to a message with .summarise
├ └ .summarise <your text>
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`
  }, { quoted: message });
}

// If text is already short, return as-is
if (textToSummarise.split(' ').length <= 15) {
  const rawLines = textToSummarise.split('\n');
  let output = '';

  for (const line of rawLines) {
    if (line.trim().length === 0) {
      output += '├\n';
    } else {
      const wrapped = wrapText(line.trim(), 30);
      for (const w of wrapped) {
        output += `├◇ ${w}\n`;
      }
    }
  }

  return sock.sendMessage(chatId, {
    text: `╭──◆「 *SUMMARISED* 」◆
├
├◇ 📝 Already short, no summary needed
├
${output}
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`
  }, { quoted: message });
}

// Start animation
loadingMsg = await sock.sendMessage(chatId, { text: LOADING_FRAMES[0] });
let frame = 0;
const interval = setInterval(async () => {
try { if (frame < LOADING_FRAMES.length - 1) { frame++; await sock.sendMessage(chatId, { edit: loadingMsg.key, text: LOADING_FRAMES[frame] }); } } catch (e) {}
}, 600);

const systemPrompt = `You are a text summariser ONLY. Your ONLY job is to summarise. STRICT RULES: If the text is a question, do NOT answer it — just return it as-is. If the text is short (under 15 words), just return it as-is. Only summarise long factual texts. Start summaries with *Here is the summary:* or *The summary of this message is:*. Keep each line under 30 characters. Use *bold* ONLY for headings on their own line. NEVER use **. NEVER use _italic_. Use • for bullets. Use emojis naturally. Text to summarise:${textToSummarise}`;

const response = await fetch('https://text.pollinations.ai/openai', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ model: 'openai', messages: [{ role: 'user', content: systemPrompt }] })
});

const data = await response.json();
const answer = data.choices?.[0]?.message?.content;

clearInterval(interval);

if (!answer || answer.length < 5) throw new Error('NO_RESPONSE');

await sock.sendMessage(chatId, { edit: loadingMsg.key, text: 'Done [■■■■■■■■■■]' });

const rawLines = answer.split('\n');
let output = '';

for (const line of rawLines) {
    if (line.trim().length === 0) {
        output += '├\n';
    } else {
        const wrapped = wrapText(line.trim(), 30);
        for (const w of wrapped) {
            output += `├◇ ${w}\n`;
        }
    }
}

await sock.sendMessage(chatId, {
    text: `╭──◆「 *SUMMARISED* 」◆
├
${output}
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`
}, { quoted: message });

} catch (error) {
    console.error('Summarise error:', error.message);

    if (loadingMsg) {
        try {
            await sock.sendMessage(chatId, {
                edit: loadingMsg.key,
                text: 'Failed [■■■■■■□□□□]'
            });
        } catch (e) {}
    }

    await sock.sendMessage(chatId, {
        text: `╭──◆「 *SUMMARISE FAILED* 」◆
├
├◇ ❌ Unable to summarise
├◇ 💡 Try again later
├
╰─┬─★─☆─♪♪─◆

╭──◆「 *GAAJU-XMD* 」◆
╰──★─☆─♪♪─◆`
    }, { quoted: message });
}
}
module.exports = summariseCommand;
