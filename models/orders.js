const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrdersSchema = new Schema({
  user: String,
  inputValue: String,
  outputValue: String,
  currencyInput: String,
  currencyOutput: String,
  paymentStatus: Number,
  fromWallet: String,
  toWallet: String,
})

const Orders = mongoose.model('order', OrdersSchema)
module.exports = Orders
