/*==================================

      🌙 MOON XMD 🌙
  DEVELOPED BY KEITH TECH
    
================================*/

const fs = require('fs')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })





const settings = {

//====== DONT CHANGE =============//
  packname: process.env.packname || 'Mr Keith Tech',
  
  author: process.env.authour || 'KEITH TECH',
  
//======= BOT SETTINGS ============//

  SESSION_ID: process.env.SESSION_ID || '',

  botName: process.env.botName || "*Mᴏᴏɴ Xᴍᴅ*",
  
  commandMode: process.env.commandMode || "private",
  
  timezone: process.env.timezone || "Africa/Harare",
  
  botOwner: process.env.botOwner || 'Keith',
  
  ownerNumber: process.env.ownerNumber || '263789745277',
  
  // Multi-prefix support
  Prefix: process.env.Prefix || ['','!','.','#','&'],
  
//======== DONT CHANGE ===========//
  giphyApiKey: process.env.giphyApiKey || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  
  maxStoreMessages: process.env.maxStoreMessages || 20, 
  
  storeWriteInterval: process.env.storeWriteInterval || 10000,
  
  description: process.env.description || "ADVANCED W.A BOT DEVELOPED BY KEITH TECH",
  
  version: process.env.version || "2.0.0",
  
  updateZipUrl: process.env.updateZipUrl || "https://github.com/mrkeithtech/Moon-Xmd/archive/refs/heads/main.zip",
  
};

module.exports = settings;