async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        await sock.sendMessage(
            chatId,
            {
                text: `╭─⌈ ⚡ *PONG* ⌋
│ ⤷ ${Date.now() - start}ms 〔█████████▒〕
╰⊷`
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('Ping error:', error);

        await sock.sendMessage(
            chatId,
            { text: '❌ Failed to get ping.' },
            { quoted: message }
        );
    }
}

module.exports = pingCommand;
