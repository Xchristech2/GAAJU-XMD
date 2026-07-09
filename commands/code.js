//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
// //
// GAAJU-X𝐌𝐃 𝐁𝐎𝐓 //
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
• GAAJU-XMD - AI Code Generator (.code)
• Powered by GitHub Models via Proxy — GPT-4o + Llama + Pollinations
• Features: AI-suggested filename | 5 fallback models | Dual file + feedback
• Professional Version
*/

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const PROXY_URL = 'https://gemini-proxy-10a1.onrender.com/v1/code';

const LOADING_FRAMES = [
'Coding [■□□□□□□□□□]',
'Coding [■■□□□□□□□□]',
'Coding [■■■□□□□□□□]',
'Coding [■■■■□□□□□□]',
'Coding [■■■■■□□□□□]',
'Coding [■■■■■■□□□□]',
'Coding [■■■■■■■□□□]',
'Coding [■■■■■■■■□□]',
'Coding [■■■■■■■■■□]'
];

const EXT_MAP = {
'javascript': 'js', 'js': 'js', 'typescript': 'ts', 'ts': 'ts',
'python': 'py', 'py': 'py', 'html': 'html', 'css': 'css',
'dart': 'dart', 'java': 'java', 'cpp': 'cpp', 'c++': 'cpp',
'c': 'c', 'csharp': 'cs', 'cs': 'cs', 'ruby': 'rb', 'rb': 'rb',
'php': 'php', 'swift': 'swift', 'kotlin': 'kt', 'kt': 'kt',
'go': 'go', 'rust': 'rs', 'rs': 'rs', 'sql': 'sql',
'json': 'json', 'xml': 'xml', 'yaml': 'yml', 'yml': 'yml',
'bash': 'sh', 'sh': 'sh', 'powershell': 'ps1', 'ps1': 'ps1',
'r': 'r', 'scala': 'scala', 'perl': 'pl', 'lua': 'lua',
'jsx': 'jsx', 'tsx': 'tsx', 'vue': 'vue', 'svelte': 'svelte',
'dockerfile': 'dockerfile', 'docker': 'dockerfile',
'markdown': 'md', 'md': 'md', 'makefile': 'makefile'
};

function wrapFeedback(text, maxLen = 25) {
const words = text.split(/\s+/);
const lines = [];
let current = '';
for (const word of words) {
if ((current + ' ' + word).length > maxLen && current.length > 0) {
lines.push(current.trim());
current = word;
} else {
current += (current ? ' ' : '') + word;
}
}
if (current) lines.push(current.trim());
return lines;
}

async function codeCommand(sock, chatId, message) {
let loadingMsg;

try {
const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
const query = text.split(' ').slice(1).join(' ').trim();

if (!query) {
return sock.sendMessage(chatId, {
text: ╭──◆「 *AI CODE GENERATOR* 」◆\n +
├\n +
├◇ 💻 Generate code with AI\n +
├◇ 🤖 GPT-4o + Llama + Pollinations\n +
├◇ 🆓 Free via GitHub Models\n +
├\n +
├◇ *📖 Usage:*\n +
├ └ .code &lt;prompt&gt;\n +
├\n +
├◇ *✨ Examples:*\n +
├ └ .code login form in html\n +
├ └ .code python fibonacci function\n +
├ └ .code discord bot in js\n +
├\n +
╰─┬─★─☆─♪♪─◆\n\n +
╭──◆「 *GAAJU-XMD* 」◆\n +
╰───★─☆─♪♪─◆
}, { quoted: message });
}

loadingMsg = await sock.sendMessage(chatId, { text: LOADING_FRAMES[0] });

let frame = 0;
const interval = setInterval(async () => {
try { if (frame < LOADING_FRAMES.length - 1) { frame++; await sock.sendMessage(chatId, { edit: loadingMsg.key, text: LOADING_FRAMES[frame] }); } } catch (e) {}
}, 600);

const response = await fetch(PROXY_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-bot-repo': 'Xchristech2/GAAJU-XMD'
},
body: JSON.stringify({ prompt: query })
});

const data = await response.json();
const answer = data.reply;
const usedModel = data.model || 'AI';

clearInterval(interval);

if (!answer || answer.length < 10) throw new Error('NO_RESPONSE');

// Extract ONLY code from inside triple backticks
const codeBlockMatch = answer.match(/[\s\S]*?/);
const cleanCode = codeBlockMatch
? codeBlockMatch[0].replace(/\w*\n?/g, '').replace(//g, '').trim()
: answer.trim();

const langMatch = codeBlockMatch ? codeBlockMatch[0].match(/```(\w+)/) : null;
const lang = langMatch ? langMatch[1].toLowerCase() : '';
const extension = EXT_MAP[lang] || 'txt';

// AI-suggested filename
const fileMatch = answer.match(/FILENAME:\s*(\w+)/i);
const fileNameWord = (fileMatch ? fileMatch[1] : 'code').toLowerCase();
const fileName = ${fileNameWord}.${extension};

// Extract feedback ONLY from text outside code blocks
const feedbackRaw = answer.replace(/[\s\S]*?/g, '').replace(/FILENAME:\s*\w+/i, '').trim();
const allFeedbackLines = wrapFeedback(feedbackRaw, 25);

// Split feedback: first half for raw, second half for demo
const mid = Math.ceil(allFeedbackLines.length / 2);
const rawFeedbackLines = allFeedbackLines.slice(0, mid);
const demoFeedbackLines = allFeedbackLines.slice(mid);

let rawFeedbackOutput = '';
for (const line of rawFeedbackLines) rawFeedbackOutput += ├◇ ${line.toLowerCase()}\n`;

let demoFeedbackOutput = '';
const demoLinesToUse = demoFeedbackLines.length > 0 ? demoFeedbackLines : rawFeedbackLines;
for (const line of demoLinesToUse) demoFeedbackOutput += ├◇${line.toLowerCase()}\n`;

const outputDir = './output';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// File 1: Raw code — pure code only
const txtFileName = ${fileNameWord}.txt`;
const txtPath = path.join(outputDir, txtFileName);
fs.writeFileSync(txtPath, cleanCode);

// File 2: Demo — clean display, no branding
let demoFileName, demoContent;
if (extension === 'html') {
demoFileName = fileName;
demoContent = cleanCode;
} else {
demoFileName = ``${fileNameWord}_preview.html; demoContent =`;
}
const demoPath = path.join(outputDir, demoFileName);
fs.writeFileSync(demoPath, demoContent);

await sock.sendMessage(chatId, { edit: loadingMsg.key, text: 'Done [■■■■■■■■■■]' });

// Send raw code file
await sock.sendMessage(chatId, {
document: fs.readFileSync(txtPath),
fileName: txtFileName,
mimetype: 'text/plain',
caption: ╭──◆「 *RAW CODE* 」◆\n +
├\n +
├◇ *💻 File:* ${txtFileName}\n+├\n+├◇ 📝 Feedback:\n+ rawFeedbackOutput +├\n+├◇ 🤖 Model:${usedModel}\n +
├\n +
╰─┬─★─☆─♪♪─◆\n\n +
╭──◆「 *GAAJU-XMD* 」◆\n +
╰───★─☆─♪♪─◆
}, { quoted: message });

// Send demo file
await sock.sendMessage(chatId, {
document: fs.readFileSync(demoPath),
fileName: demoFileName,
mimetype: 'text/html',
caption: ╭──◆「 *${extension === 'html' ? 'LIVE PREVIEW' : 'CODE PREVIEW'}* 」◆\n+├\n+├◇ 💻 File:${demoFileName}\n +
├\n +
├◇ *📝 Feedback:*\n +
demoFeedbackOutput +
├\n +
├◇ *🤖 Model:* ${usedModel}\n +
├\n +
╰─┬─★─☆─♪♪─◆\n\n +
╭──◆「 *GAAJU-XMD* 」◆\n +
╰───★─☆─♪♪─◆
}, { quoted: message });

fs.unlinkSync(txtPath);
fs.unlinkSync(demoPath);

} catch (error) {
console.error('Code error:', error.message);
if (loadingMsg) { try { await sock.sendMessage(chatId, { edit: loadingMsg.key, text: 'Failed [■■■■■■□□□□]' }); } catch (e) {} }
await sock.sendMessage(chatId, {
text: ╭──◆「 *CODE FAILED* 」◆\n├\n├◇ ❌ Unable to generate code\n├◇ 💡 Try a different prompt\n├\n╰─┬─★─☆─♪♪─◆\n\n╭──◆「 *GAAJU-XMD* 」◆\n╰───★─☆─♪♪─◆
}, { quoted: message });
}
}

module.exports = codeCommand;
