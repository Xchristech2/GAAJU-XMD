//════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                                                                                                        //
//                                                             GAAJU-X𝐌𝐃 𝐁𝐎𝐓                                                                                                     //
//                                                                                                                                                                                        //
//                                                                  𝐕 : 1.0.0                                                                                                             //
//                                                                                                                                                                                        //
//                                                                                                                                                                                        //
//                ██╗    ██╗ █████╗ ██╗     ██╗  ██╗   ██╗   ██╗ █████╗ ██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗      ███╗   ███╗██████╗                                 //
//                ██║    ██║██╔══██╗██║     ██║  ╚██╗ ██╔╝   ██║██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝██╔════╝██║  ██║      ████╗ ████║██╔══██╗                              //
//                ██║ █╗ ██║███████║██║     ██║   ╚████╔╝    ██║███████║ ╚████╔╝    ██║   █████╗  ██║     ███████║█████╗██╔████╔██║██║  ██║                               //
//                ██║███╗██║██╔══██║██║     ██║    ╚██╔╝██   ██║██╔══██║  ╚██╔╝     ██║   ██╔══╝  ██║     ██╔══██║╚════╝██║╚██╔╝██║██║  ██║                               //
//                ╚███╔███╔╝██║  ██║███████╗███████╗██║ ╚█████╔╝██║  ██║   ██║      ██║   ███████╗╚██████╗██║  ██║      ██║ ╚═╝ ██║██████╔╝                              //
//                 ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝      ╚═╝     ╚═╝╚═════╝                                 //
//                                                                                                                                                                                        //
//                                                                 𝐂𝐎𝐏𝐘𝐑𝐈𝐆𝐇𝐓 2025                                                                                                        //
//                                                                                                                                                                                        //
//                                                                                                                                                                                        //
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

async function subscribeCommand(sock, chatId, message) {
    const text = `╭──◆「 *PREMIUM SUB* 」◆\n` +
        `├\n` +
        `├◇ ⭐ Unlock all premium features\n` +
        `├◇ 🤖 AI | 🎨 Images | 🎵 Media\n` +
        `├\n` +
        `├◇ *💰 Plan:*\n` +
        `├  └ Monthly — ₦5000\n` +
        `├  └ Multi Currency Support\n` +
        `├\n` +
        `├◇ *💳 Payment Methods:*\n` +
        `├\n` +
        `├◇ *1️⃣ Pay Online (Selar)*\n` +
        `├  └ Card | Bank | USSD\n` +
        `├  └ https://selar.com/78a55u73jm\n` +
        `├\n` +
        `├◇ *2️⃣ Manual Transfer*\n` +
        `├  └ *Bank:* Palpay\n` +
        `├  └ *Acct:* 9095991180\n` +
        `├  └ *Name:* CHIMBIKO ROSBERY UZUKWU\n` +
        `├\n` +
        `├◇ *📞 Contact:* +2348069675806\n` +
        `├◇ *📧 Send proof after payment*\n` +
        `├\n` +
        `╰─┬─★─☆─♪♪─◆\n\n` +
        `╭──◆「 *GAAJU-XMD* 」◆\n` +
        `╰──★─☆─♪♪─◆`;

    await sock.sendMessage(chatId, { text }, { quoted: message });
}

module.exports = subscribeCommand;
