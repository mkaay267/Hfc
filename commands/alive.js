const settings = require("../settings");
const { Vcard } = require('../lib/Keith');

async function aliveCommand(sock, chatId, message) {
    try {
    await sock.sendMessage(chatId, {
            react: { text: '❄', key: message.key }
        });
        const message1 = `
╔═════════════╗
║  🌙 MOON XMD 🌙
╚═════════════╝

┌─ *BOT STATUS*
│ ✨ Status: *Online*
│ 🚀 Version: *${settings.version}*
│ 🌐 Mode: *${settings.commandMode}*
└─

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴏᴏɴ xᴍᴅ`;

        
      await sock.sendMessage(chatId, { text: message1},{ quoted: Vcard });
      
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '🌙 MOON XMD is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;