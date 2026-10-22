async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        await sock.sendMessage(
            chatId,
            { text: '🏓 *Pong!*' },
            { quoted: message }
        );

        const ping = Date.now() - start;

        await sock.sendMessage(
            chatId,
            {
                text: `╭─⌈ ⚡ *PONG* ⌋
│ ⤷ ${ping}ms 〔█████████▒〕
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
