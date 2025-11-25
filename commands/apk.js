// CODES BY KEITH TECH

const fetch = require('node-fetch');
const axios = require('axios');

async function apkCommand(sock, chatId, message, userMessage) {
    try {
        // Extract app name from command
        const appName = userMessage.slice(4).trim();

        if (!appName) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Please provide the app name!*\n\n*Usage:* .apk <app name>\n*Example:* .apk WhatsApp'
            }, { quoted: message });
        }

        // Send reaction - searching
        await sock.sendMessage(chatId, {
            react: { text: '⬇️', key: message.key }
        });

        // Fetch APK data from Aptoide API
        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(appName)}/limit=1`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.datalist || !data.datalist.list.length) {
            await sock.sendMessage(chatId, {
                react: { text: '❌', key: message.key }
            });
            return await sock.sendMessage(chatId, {
                text: '⚠️ *No results found for the given app name.*\n\nPlease try a different search term.'
            }, { quoted: message });
        }

        const app = data.datalist.list[0];
        const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

        // Prepare caption with app details
        const caption = `
╭━〔  *Mᴏᴏɴ Xᴍᴅ  Aᴘᴋ* 〕┈⊷
┃ 📦 *Nᴀᴍᴇ:* ${app.name}
┃ 🏋 *Sɪᴢᴇ:* ${appSize} MB
┃ 📦 *Pᴀᴄᴋᴀɢᴇ:* ${app.package}
┃ 📅 *Uᴘᴅᴀᴛᴇᴅ ᴏɴ:* ${app.updated}
┃ 👨‍💻 *Dᴇᴠᴇʟᴏᴘᴇʀ:* ${app.developer.name}
╰━━━━━━━━━━━━━┈⊷
> ⏳ *ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴘᴋ...*

> *© ᴋᴇɪᴛʜ ᴛᴇᴄʜ ɪɴᴄ*`;

        // Send app icon with details if available
        if (app.icon) {
            await sock.sendMessage(chatId, {
                image: { url: app.icon },
                caption: caption,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363417440480101@newsletter',
                        newsletterName: 'Kᴇɪᴛʜ ᴛᴇᴄʜ',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: caption,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363417440480101@newsletter',
                        newsletterName: 'KEITH TECH',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        // Send reaction - uploading
        await sock.sendMessage(chatId, {
            react: { text: '⬆️', key: message.key }
        });

        // Send APK file
        await sock.sendMessage(chatId, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: `✅ *Aᴘᴋ Dᴏᴡɴʟᴏᴀᴅᴇᴅ Sᴜᴄᴄᴇꜱꜰᴜʟʟʏ!*
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Mᴏᴏɴ Xᴍᴅ 🌙`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363417440480101@newsletter',
                    newsletterName: 'KEITH TECH',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        // Send reaction - completed
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

    } catch (error) {
        console.error('Error in APK command:', error);
        
        // Send error reaction
        await sock.sendMessage(chatId, {
            react: { text: '❌', key: message.key }
        });
        
        await sock.sendMessage(chatId, {
            text: '❌ *An error occurred while fetching the APK.*\n\nPlease try again later or use a different app name.'
        }, { quoted: message });
    }
}

module.exports = apkCommand;