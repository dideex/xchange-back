const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrencySchema = new Schema({
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
})

const CurrencyRealSchema = new Schema({
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
})

const CurrenciesSchema = new Schema({
  id: {
    type: String,
    required: [true],
  },
  name: String,
  label: String,
  price_usd: String,
  change: String,
  minimum: String,
  reserved: String,
  type: String,
  base: String,
})

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('currency', CurrenciesSchema)
