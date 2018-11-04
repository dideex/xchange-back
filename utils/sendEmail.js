const config = require('../config/config.json')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(config.mail.smtp)

// transporter.sendMail(mailOptions, function(error, info) {
//   //если есть ошибки при отправке - сообщаем об этом
//   if (error) {
//     console.log(' LOG ___ error ', error)
//   }
//   console.log(" LOG ___'ok' ", 'ok')
// })

module.exports.sendEmail = (email, phone, message) =>
  new Promise((res, rej) => {
    const mailOptions = {
      from: `"${email}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: `Message from + ${phone}`,
      text: `${message}` + `\n Отправлено с: <${email}>`,
    }
    transporter.sendMail(mailOptions, function(error, info) {
      //если есть ошибки при отправке - сообщаем об этом
      if (error) {
        rej()
      }
      res()
    })
  })

module.exports.notificationByEmail = (currency, value) =>
  new Promise((res, rej) => {
    const mailOptions = {
      from: `web site`,
      to: config.mail.smtp.auth.user,
      subject: `Новый перевод от ${value} ${currency}`,
      text: `Новый перевод на сумму ${value} ${currency}`,
    }
    transporter.sendMail(mailOptions, function(error, info) {
      //если есть ошибки при отправке - сообщаем об этом
      if (error) {
        rej()
      }
      res()
    })
  })
