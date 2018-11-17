const TelegramBot = require('node-telegram-bot-api')
const {token, proxy, adminId} = require('../config/config.json').telegram
const Agent = require('socks5-https-client/lib/Agent')
// replace the value below with the Telegram token you receive from @BotFather
// const token = 'YOUR_TELEGRAM_BOT_TOKEN';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true,
  request: {
    proxy,
    // proxy: 'http://localhost:8118/',
    // agentClass: Agent,
    // agentOptions: proxy
  },
})

module.exports.sendMessage = message => {
  bot.sendMessage(adminId, message)
}