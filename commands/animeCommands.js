const settings = require('../settings');
const axios = require('axios');
const fs = require('fs');

// ======================= LEAVE GROUP FUNCTION =======================
async function leaveCommand(sock, chatId, message, isGroup, isOwner) {
    try {
        if (!isGroup) {
            return await sock.sendMessage(chatId, { 
                text: "❗ This command can only be used in *groups*." 
            }, { quoted: message });
        }

        if (!isOwner) {
            return await sock.sendMessage(chatId, { 
                text: "❗ This command can only be used by my *owner*." 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { 
            text: `👋 *Goodbye everyone!*\nI am leaving the group now.\nThanks for having me here! ❤️` 
        }, { quoted: message });

        setTimeout(async () => {
            await sock.groupLeave(chatId);
        }, 1500);

    } catch (e) {
        console.error(e);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${e.message}` 
        }, { quoted: message });
    }
}

// ======================= ANIME GARL FUNCTION =======================
async function garlCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon');
        const wm = `😎 Random Garl image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.data[0].urls.original }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= WAIFU FUNCTION =======================
async function waifuCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/waifu');
        const wm = `🩵 Random Waifu image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.url }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= NEKO FUNCTION =======================
async function nekoCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/neko');
        const wm = `🩷 Random neko image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.url }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= MEGUMIN FUNCTION =======================
async function meguminCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/megumin');
        const wm = `❤️‍🔥 Random megumin image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.url }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= MAID FUNCTION =======================
async function maidCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.im/search/?included_tags=maid');
        const wm = `😎 Random maid image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.images[0].url }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= AWOO FUNCTION =======================
async function awooCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/awoo');
        const wm = `😎 Random awoo image\n\n©KEITH-TECH`;
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.url }, 
            caption: wm 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: "I can't find this anime." 
        }, { quoted: message });
    }
}

// ======================= ANIME GIRL FUNCTIONS =======================
async function animeGirlCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.waifu.pics/sfw/waifu');
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.url }, 
            caption: '*ANIME GIRL IMAGE* 🥳\n\n\n*> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ KEITH TECH*' 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `*Error Fetching Anime Girl image*: ${e.message}` 
        }, { quoted: message });
    }
}

// ======================= ANIME BATCH FUNCTION =======================
async function animeCommand(sock, chatId, message) {
    try {
        const images = [
            'https://telegra.ph/file/b26f27aa5daaada031b90.jpg',
            'https://telegra.ph/file/51b44e4b086667361061b.jpg',
            'https://telegra.ph/file/7d165d73f914985542537.jpg',
            'https://telegra.ph/file/3d9732d2657d2d72dc102.jpg',
            'https://telegra.ph/file/8daf7e432a646f3ebe7eb.jpg',
            'https://telegra.ph/file/7514b18ea89da924e7496.jpg',
            'https://telegra.ph/file/ce9cb5acd2cec7693d76b.jpg'
        ];
        
        const dec = `> *MOON-XMD ANIME IMGS*`;
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: dec 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= ANIME1 FUNCTION =======================
async function anime1Command(sock, chatId, message) {
    try {
        const images = [
            'https://i.waifu.pics/aD7t0Bc.jpg',
            'https://i.waifu.pics/PQO5wPN.jpg',
            'https://i.waifu.pics/5At1P4A.jpg',
            'https://i.waifu.pics/MjtH3Ha.jpg',
            'https://i.waifu.pics/QQW7VKy.jpg'
        ];
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: '> © KEITH-TECH' 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= ANIME2 FUNCTION =======================
async function anime2Command(sock, chatId, message) {
    try {
        const images = [
            'https://i.waifu.pics/0r1Bn88.jpg',
            'https://i.waifu.pics/2Xdpuov.png',
            'https://i.waifu.pics/0hx-3AP.png',
            'https://i.waifu.pics/q054x0_.png',
            'https://i.waifu.pics/4lyqRvd.jpg'
        ];
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: '> © KEITH-TECH' 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= ANIME3 FUNCTION =======================
async function anime3Command(sock, chatId, message) {
    try {
        const images = [
            'https://i.waifu.pics/gnpc_Lr.jpeg',
            'https://i.waifu.pics/P6X-ph6.jpg',
            'https://i.waifu.pics/~p5W9~k.png',
            'https://i.waifu.pics/7Apu5C9.jpg',
            'https://i.waifu.pics/OTRfON6.jpg'
        ];
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: '> © KEITH-TECH' 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= ANIME4 FUNCTION =======================
async function anime4Command(sock, chatId, message) {
    try {
        const images = [
            'https://i.waifu.pics/aGgUm80.jpg',
            'https://i.waifu.pics/i~RQhRD.png',
            'https://i.waifu.pics/94LH-aU.jpg',
            'https://i.waifu.pics/V8hvqfK.jpg',
            'https://i.waifu.pics/lMiXE7j.png'
        ];
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: '> © KEITH-TECH' 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= ANIME5 FUNCTION =======================
async function anime5Command(sock, chatId, message) {
    try {
        const images = [
            'https://i.waifu.pics/-ABlAvr.jpg',
            'https://i.waifu.pics/HNEg0-Q.png',
            'https://i.waifu.pics/3x~ovC6.jpg',
            'https://i.waifu.pics/brv-GJu.jpg',
            'https://i.waifu.pics/FWE8ggD.png'
        ];
        
        for (const img of images) {
            await sock.sendMessage(chatId, { 
                image: { url: img }, 
                caption: '> © KEITH-TECH' 
            }, { quoted: message });
        }
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `${e}` 
        }, { quoted: message });
    }
}

// ======================= DOG FUNCTION =======================
async function dogCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://dog.ceo/api/breeds/image/random');
        
        await sock.sendMessage(chatId, { 
            image: { url: res.data.message }, 
            caption: '> *© Powered By KEITH-AI*' 
        }, { quoted: message });
    } catch (e) {
        console.log(e);
        await sock.sendMessage(chatId, { 
            text: `Error fetching dog image: ${e.message}` 
        }, { quoted: message });
    }
}

// ======================= EXPORTS =======================
module.exports = {
    leaveCommand,
    garlCommand,
    waifuCommand,
    nekoCommand,
    meguminCommand,
    maidCommand,
    awooCommand,
    animeGirlCommand,
    animeCommand,
    anime1Command,
    anime2Command,
    anime3Command,
    anime4Command,
    anime5Command,
    dogCommand
};