const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrdersSchema = new Schema({
  user: String,
  inputValue: String,
  outputValue: String,
  currencyInput: String,
  currencyInputLabel: String,
  currencyOutput: String,
  currencyOutputLabel: String,
  paymentStatus: String,
  fromWallet: String,
  toWallet: String,
  created: {type: Date, default: Date.now},
})

const Orders = mongoose.model('order', OrdersSchema)
module.exports = Orders