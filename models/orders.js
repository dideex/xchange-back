const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrdersSchema = new Schema({
  user: String,
  inputValue: String,
  outputValue: String,
  outputValueInUsd: String,
  currencyInput: String,
  currencyInputLabel: String,
  currencyOutput: String,
  currencyOutputLabel: String,
  paymentStatus: String,
  fromWallet: String,
  toWallet: String,
  email: String,
  created: {type: Date, default: Date.now},
})

const Orders = mongoose.model('order', OrdersSchema)

const getConvertedAmount = user =>
  Orders.find({user, paymentStatus: 3}).then(data =>
    data.reduce((amount, order) => amount + +order.outputValueInUsd, 0),
  )

module.exports = {Orders, getConvertedAmount, OrdersSchema}
