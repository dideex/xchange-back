const Orders = require('../models/orders')

module.exports.addOrder = (req, res) => {
  const {id} = req.payload
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
    user: id,
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
  const {_id} = req.body
  Orders.findOneAndUpdate({_id}, {$set: {paymentStatus: 2}})
    .then(result => res.status(201).json({result}))
    .catch(err => res.status(400).json({err}))
}

module.exports.getAuthOrders = (req, res) => {
  const {id} = req.payload
  if (!id) res.status(401).json({err: 'Unauthorized '})

  Orders.find({user: id})
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(404).json({err: 'Данных не найдено', errCode: 2, errMsg: err}),
    )
}
