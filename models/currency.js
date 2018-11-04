const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrenciesSchema = new Schema({
  id: {
    type: String,
    required: [true],
  },
  name: String,
  label: String,
  price_usd: String,
  change: String,
  minimal: String,
  reserve: String,
  type: String,
  base: String,
  icon: String,
  mask: String,
  order: Number,
})

mongoose.model('currency', CurrenciesSchema, 'currency')
