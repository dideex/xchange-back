const TelegramBot = require('node-telegram-bot-api')
const {token, proxy, adminId} = require('../config/config.json').telegram
const Agent = require('socks5-https-client/lib/Agent')
// replace the value below with the Telegram token you receive from @BotFather
// const token = 'YOUR_TELEGRAM_BOT_TOKEN';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true,
  request: {
    // proxy: 'http://46.101.240.221:1080'
    agentClass: Agent,
    agentOptions: proxy
  },
})

bot.on('message', msg => {
  const chatId = msg.chat.id
  console.log(' LOG ___ msg ', msg)
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message')
})

module.exports.sendMessage = message => {
  bot.sendMessage(adminId, message)
}