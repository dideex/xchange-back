const {Orders} = require('../models/orders')
const emailSender = require('../utils/sendEmail')
const {Currency, getRate} = require('../models/currency')
// const Telegram = require('../bot')
const rate = require('../config/config.json').rateExchange
const emailValid = require('../utils/email')

const validateOrder = async order => {
  if (
    Object.values(order).filter(value => value === undefined || value === '')
      .length
  )
    return {err: 'Введите все поля', errCode: 31}
  const {inputValue, outputValue, currencyInput, currencyOutput} = order

  const rateExchange = await getRate(currencyInput, currencyOutput)
  if (rateExchange === null)
    return {
      err: 'Ошибка синхронизации с сервером, обновите страницу',
      errCode: 32,
    }
  const threshold = Math.abs(+inputValue * rateExchange * rate - +outputValue)
  if (threshold > 0.01 || threshold !== threshold)
    return {
      err: 'Ошибка синхронизации с сервером, обновите страницу',
      errCode: 32,
    }
  return {success: true}
}

module.exports.addOrder = async (req, res) => {
  const {id} = req.payload
  const orderData = {user: id, ...req.body}
  const valid = await validateOrder(orderData)

  if (valid.err) res.status(500).json(valid)
  else {
    const Order = new Orders(orderData)
    Order.save()
      .then(result => res.status(201).json({result}))
      .catch(() =>
        res.status(500).json({err: 'Ошибка сервера транзакций', errCode: 30}),
      )
  }
}

module.exports.addGuestOrder = async (req, res) => {
  const orderData = {user: 'Guest', ...req.body, token: true}
  const valid = await validateOrder(orderData)

  if (valid.err) res.status(500).json(valid)
  else {
    const Order = new Orders(orderData)

    Order.save()
      .then(result => res.status(201).json({result}))
      .catch(() =>
        res.status(500).json({err: 'Ошибка сервера транзакций', errCode: 30}),
      )
  }
}

module.exports.confirmOrder = (req, res) => {
  const {_id, value, currency, email, token} = req.body
  if (!emailValid.test(email) || !value || !currency || !_id)
    res.status(401).json({err: 'Введите все данные', errCode: 35})
  else
    Orders.findOneAndUpdate({_id}, {$set: {paymentStatus: 2}})
      .then(result => {
        // Telegram.sendMessage(
        //   `Был создан перевод на сумму ${value} ${currency} \r\n ссылка http://localhost:3000/summary/${_id}`,
        // )
        res.status(201).json({result})
        emailSender.notificationByEmail(
          value,
          currency,
          'http://localhost:3000/summary/' + _id,
        )
        const userLink = token
          ? `http://localhost:3000/lichnii-kabinet/${_id}`
          : `http://localhost:3000/perevod/${_id}`
        emailSender.userNotificationByEmail(email, value, currency, userLink)
      })
      .catch(() =>
        res.status(401).json({err: 'Ошибка сервера транзакций', errCode: 30}),
      )
}

module.exports.getAuthOrders = (req, res) => {
  const {id} = req.payload
  if (!id)
    res.status(401).json({err: 'Ошибка сервера авторизации', errCode: 40})

  Orders.find({user: id})
    .sort([['created', -1]])
    .then(data => res.status(200).json(data))
    .catch(() =>
      res.status(401).json({
        err: 'Ошибка сервера, такой пользователь не найден',
        errCode: 33,
      }),
    )
}

module.exports.sendEmail = (req, res) => {
  const {email, phone, message} = req.body
  if (!emailValid.test(email) || !phone)
    res.status(401).json({err: 'Введите все данные', errCode: 35})
  else
    emailSender
      .sendEmail(email, phone, message)
      .then(() => res.status(200).json({status: 'Отправлено'}))
      .catch(() =>
        res.status(401).json({err: 'Ошибка сервера транзакций', errCode: 30}),
      )
}

module.exports.getGuestOrder = (req, res) => {
  const {_id} = req.query
  if (!_id) res.status(400).json({err: 'Введите _id'})

  Orders.findOne({user: 'Guest', _id})
    .then(data => {
      if (!data)
        res
          .status(401)
          .json({err: 'Запрашеваемая транзакция не найдена', errCode: 34})
      else res.status(200).json(data)
    })
    .catch(() =>
      res.status(401).json({err: 'Ошибка сервера транзакций', errCode: 30}),
    )
}
