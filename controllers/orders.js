const Orders = require('../models/orders')

module.exports.addOrder = function(req, res) {
  const {id} = req.payload
  const {
    inputValue,
    outputValue,
    currencyInput,
    currencyOutput,
    paymentStatus,
    fromWallet,
    toWallet,
  } = req.body

  const Order = new Orders({
    user: id,
    inputValue,
    outputValue,
    currencyInput,
    currencyOutput,
    fromWallet,
    toWallet,
    paymentStatus: +paymentStatus,
  })

  Order.save().then(() => res.status(201).json({success: true}))
}
module.exports.addGuestOrder = function(req, res) {
  const {
    inputValue,
    outputValue,
    currencyInput,
    currencyOutput,
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
    fromWallet,
    toWallet,
    paymentStatus: +paymentStatus,
  })

  Order.save().then(() => res.status(201).json({success: true}))
}
