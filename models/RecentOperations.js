const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OperationsSchema = new Schema({
  email: String,
  inputValue: String,
  outputValue: String,
  paymentStatus: String,
  currency: String,
  inputLabel: String,
  outputLabel: String,
})

mongoose.model('operations', OperationsSchema)
