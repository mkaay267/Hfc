const os = require('os');
const settings = require('../settings.js');
const { Vcard } = require('../lib/Keith');


async function pingCommand(sock, chatId, message) {
    try {
    
        const start = Date.now();
const responseTime = (Date.now() - start) / 1000;

       

        const pinginfo = `
> 🔸️ *Pong!* ${responseTime}ms
`.trim();

        // Reply to the original message with the bot info
        await sock.sendMessage(chatId, { text: pinginfo},{ quoted: Vcard });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' });
    }
}

module.exports = pingCommand;
