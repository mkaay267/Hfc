// CODES BY KEITH TECH

require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Bot start time for uptime calculation
const botStartTime = Date.now();

// Function to get uptime
function getUptime() {
    const uptime = Date.now() - botStartTime;
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log(chalk.green('🧹 Garbage collection completed'))
    }
}, 60_000) // every 1 minute

// Memory monitoring - Restart if RAM gets too high (increased threshold for stability)
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 450) {
        console.log(chalk.red('⚠️ RAM too high (>450MB), restarting bot...'))
        process.exit(1) // Panel will auto-restart
    }
}, 30_000) // check every 30 seconds

let phoneNumber = "263789755277"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "MOON XMD"
global.themeemoji = "🌙"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

// Helper function to get formatted time with timezone
function getFormattedTime(timezone = 'Africa/Harare') {
    try {
        return new Date().toLocaleString('en-US', { 
            timeZone: timezone,
            dateStyle: 'full',
            timeStyle: 'long'
        })
    } catch (error) {
        console.log(chalk.red(`Invalid timezone: ${timezone}, using default`))
        return new Date().toLocaleString('en-US', { 
            timeZone: 'Africa/Harare',
            dateStyle: 'full',
            timeStyle: 'long'
        })
    }
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// SESSION ID FUNCTIONS
async function downloadSessionData() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (!fs.existsSync(credsPath)) {
      if (!settings.SESSION_ID) {
        return console.log(chalk.red('Session id not found at SESSION_ID!\nCreds.json not found at session folder!\n\nWait to enter your number'));
      }

      const base64Data = settings.SESSION_ID.split("Moon~")[1];
      const sessionData = Buffer.from(base64Data, 'base64');
      
      await fs.promises.writeFile(credsPath, sessionData);
      console.log(chalk.green('Session successfully saved, please wait!!'));
      await startXeonBotInc();
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}

async function startXeonBotInc() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(XeonBotInc.ev)

    // Message handling
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, chatUpdate);
                return;
            }
            if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                if (!isGroup) return
            }
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

            if (XeonBotInc?.msgRetryCounterCache) {
                XeonBotInc.msgRetryCounterCache.clear()
            }

            try {
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                if (mek.key && mek.key.remoteJid) {
                    await XeonBotInc.sendMessage(mek.key.remoteJid, {
                        text: '❌ Error processing command!',
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    XeonBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    XeonBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    XeonBotInc.getName = (jid, withoutContact = false) => {
        id = XeonBotInc.decodeJid(jid)
        withoutContact = XeonBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
            XeonBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    XeonBotInc.public = true

    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

    // Handle pairing code
    if (pairingCode && !XeonBotInc.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        console.log(chalk.cyan('\n╔════════════════════════════════════════════════════╗'))
        console.log(chalk.cyan('║     🌙 MOON XMD PAIRING CODE SYSTEM 🌙            ║'))
        console.log(chalk.cyan('╚════════════════════════════════════════════════════╝\n'))

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            console.log(chalk.yellow('📱 Please enter your WhatsApp number'))
            console.log(chalk.gray('   Format: Country code + Number (without + or spaces)'))
            console.log(chalk.gray('   Example: 263789755277\n'))
            phoneNumber = await question(chalk.green('👉 Enter your number: '))
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('\n❌ Invalid phone number format!'))
            console.log(chalk.yellow('Please enter your full international number'))
            console.log(chalk.gray('Example: 26378975** (Zimbabwe)'))
            console.log(chalk.gray('Example: 15551234567 (USA)'))
            process.exit(1);
        }

        console.log(chalk.green('\n✅ Valid number detected!'))
        console.log(chalk.cyan('⏳ Generating pairing code...\n'))

        setTimeout(async () => {
            try {
                let code = await XeonBotInc.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                
                console.log(chalk.cyan('\n╔════════════════════════════════════════════════════╗'))
                console.log(chalk.cyan('║              🔐 YOUR PAIRING CODE 🔐               ║'))
                console.log(chalk.cyan('╠════════════════════════════════════════════════════╣'))
                console.log(chalk.cyan('║                                                    ║'))
                console.log(chalk.cyan(`║              ${chalk.bgGreen.black.bold(`   ${code}   `)}              ║`))
                console.log(chalk.cyan('║                                                    ║'))
                console.log(chalk.cyan('╚════════════════════════════════════════════════════╝\n'))
                
                console.log(chalk.yellow('📲 STEPS TO CONNECT:'))
                console.log(chalk.white('   1️⃣  Open WhatsApp on your phone'))
                console.log(chalk.white('   2️⃣  Go to Settings → Linked Devices'))
                console.log(chalk.white('   3️⃣  Tap "Link a Device"'))
                console.log(chalk.white('   4️⃣  Tap "Link with phone number instead"'))
                console.log(chalk.white(`   5️⃣  Enter the code: ${chalk.green.bold(code)}`))
                console.log(chalk.cyan('\n⏱️  Code expires in 60 seconds!\n'))
                console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))
            } catch (error) {
                console.error(chalk.red('\n❌ Error generating pairing code!'))
                console.error(chalk.yellow('Details:'), error.message)
                console.log(chalk.cyan('\n💡 Tips:'))
                console.log(chalk.white('   • Check your internet connection'))
                console.log(chalk.white('   • Verify your phone number is correct'))
                console.log(chalk.white('   • Try again in a few moments\n'))
            }
        }, 3000)
    }

    // Connection handling
    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            const userTimezone = settings.timezone || 'Africa/Harare'
            const currentTime = getFormattedTime(userTimezone)
            
            console.log(chalk.cyan(`\n╔════════════════════════════════════════╗`))
            console.log(chalk.cyan(`║     🌙 MOON XMD CONNECTING...         ║`))
            console.log(chalk.cyan(`╚════════════════════════════════════════╝\n`))
            
            await delay(2000)
            
            console.log(chalk.green.bold(`✅ SUCCESSFULLY CONNECTED!\n`))
            console.log(chalk.blue(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`))
            console.log(chalk.yellow(`📱 Bot Number: ${XeonBotInc.user.id.split(':')[0]}`))
            console.log(chalk.yellow(`🤖 Bot Name: ${global.botname}`))
            console.log(chalk.yellow(`⏰ Connected At: ${currentTime}`))
            console.log(chalk.yellow(`🌍 Timezone: ${userTimezone}`))
            console.log(chalk.yellow(`⚡ Status: Online & Ready`))
            console.log(chalk.blue(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`))

            const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
            const uptimeNow = getUptime();
            
            await XeonBotInc.sendMessage(botNumber, {
                text: `╔═════════════════╗
║ 🌙 *MOON XMD ONLINE* 🌙
╚═════════════════╝

✅ *Status:* Connected Successfully!
⏰ *Time:* ${currentTime}
⏱️ *Uptime:* ${uptimeNow}
🌍 *Timezone:* ${userTimezone}
🤖 *Bot:* ${global.botname}
📱 *Number:* ${XeonBotInc.user.id.split(':')[0]}

━━━━━━━━━━━━━━━━━━━━━
💫 All Systems Operational
🚀 Ready to Serve!
━━━━━━━━━━━━━━━━━━━━━

_Powered by Keith Tech_ 🌙`,
                contextInfo: {
                    externalAdReply: {
                        title: '🌙 MOON XMD CONNECTED',
                        body: 'Bot is now online and ready!',
                        thumbnailUrl: './assets/Repo-img.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029VadduTqGk1FHregOKP2W',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });

            console.log(chalk.cyan(`\n${global.themeemoji} Developer: Keith Tech`))
            console.log(chalk.cyan(`${global.themeemoji} GitHub: github.com/mrkeithtech`))
            console.log(chalk.cyan(`${global.themeemoji} Channel: ${global.channelLink || 'N/A'}`))
        }
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                try {
                    rmSync('./session', { recursive: true, force: true })
                } catch { }
                console.log(chalk.red('Session logged out. Please re-authenticate.'))
                startXeonBotInc()
            } else {
                console.log(chalk.yellow('Connection closed. Reconnecting...'))
                startXeonBotInc()
            }
        }
    })

    // Track recently-notified callers to avoid spamming messages
    const antiCallNotified = new Set();

    // Anticall handler
    XeonBotInc.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                try {
                    try {
                        if (typeof XeonBotInc.rejectCall === 'function' && call.id) {
                            await XeonBotInc.rejectCall(call.id, callerJid);
                        } else if (typeof XeonBotInc.sendCallOfferAck === 'function' && call.id) {
                            await XeonBotInc.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await XeonBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                } catch {}
                setTimeout(async () => {
                    try { await XeonBotInc.updateBlockStatus(callerJid, 'block'); } catch {}
                }, 800);
            }
        } catch (e) {
            // ignore
        }
    });

    XeonBotInc.ev.on('creds.update', saveCreds)

    XeonBotInc.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(XeonBotInc, update);
    });

    XeonBotInc.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(XeonBotInc, m);
        }
    });

    XeonBotInc.ev.on('status.update', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    XeonBotInc.ev.on('messages.reaction', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    return XeonBotInc
}

// Start the bot with error handling
startXeonBotInc().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})