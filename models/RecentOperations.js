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
  created: {type: Date, default: Date.now},
})

const Operations = mongoose.model('operations', OperationsSchema)

module.exports = {OperationsSchema, Operations}
