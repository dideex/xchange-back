const Orders = require('../models/orders')
const emailSender = require('../utils/sendEmail')
const Currency = require('../models/currency.js')
const Telegram = require('../bot')

const validateOrder = async order => {
  if (
    Object.values(order).filter(value => value === undefined || value === '')
      .length
  )
    return {err: 'Введите все поля'}
  const {inputValue, outputValue, currencyInput, currencyOutput} = order

  const rateExchange = await Currency.getRate(currencyInput, currencyOutput)
  if (rateExchange === null) return {err: 'Ошибка синхронизации'}
  const threshold = Math.abs(+inputValue * rateExchange - +outputValue)
  if (threshold > 1 || threshold !== threshold)
    return {err: 'Ошибка синхронизации'}
  return {success: true}
}

module.exports.addOrder = async (req, res) => {
  const {id} = req.payload
  const orderData = {user: id, ...req.body}
  const valid = await validateOrder(orderData)

  if (valid.err) res.status(418).json({error: valid.err})
  else {
    const Order = new Orders(orderData)
    Order.save().then(result => res.status(201).json({result}))
  }
}

module.exports.addGuestOrder = (req, res) => {
  const {
    inputValue,
    outputValue,
    currencyInput,
    currencyOutput,
    currencyInputLabel,
    currencyOutputLabel,
    paymentStatus,
    fromWallet,
    toWallet,
  } = req.body

  const Order = new Orders({
    user: 'Guest',
    inputValue,
    outputValue,
    currencyInput,
    currencyOutput,
    currencyInputLabel,
    currencyOutputLabel,
    fromWallet,
    toWallet,
    paymentStatus,
  })

  Order.save().then(result => res.status(201).json({result}))
}

module.exports.confirmOrder = (req, res) => {
  const {_id, value, currency} = req.body
  Orders.findOneAndUpdate({_id}, {$set: {paymentStatus: 2}})
    .then(result => {
      Telegram.sendMessage(
        `Был создан перевод на сумму ${value} ${currency} \r\n ссылка`,
      )
      res.status(201).json({result})
      emailSender.notificationByEmail(value, currency)
    })
    .catch(err => res.status(400).json({err}))
}

module.exports.getAuthOrders = (req, res) => {
  const {id} = req.payload
  if (!id) res.status(401).json({err: 'Unauthorized '})

  Orders.find({user: id})
    .sort([['created', -1]])
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(404).json({err: 'Данных не найдено', errCode: 2, errMsg: err}),
    )
}

module.exports.sendEmail = (req, res) => {
  const {email, phone, message} = req.body
  emailSender
    .sendEmail(email, phone, message)
    .then(() => res.status(200).json({status: 'Отправлено'}))
    .catch(err => res.status(500).json({status: 'Ошибка сервера', err}))
}

module.exports.getGuestOrder = (req, res) => {
  const {_id} = req.query
  if (!_id) res.status(400).json({err: 'Введите _id'})

  Orders.findOne({user: 'Guest', _id})
    .then(data => {
      if (!data)
        res
          .status(404)
          .json({err: 'Данных не найдено', errCode: 2, errMsg: err})
      res.status(200).json(data)
    })
    .catch(err =>
      res.status(404).json({err: 'Данных не найдено', errCode: 2, errMsg: err}),
    )
}
