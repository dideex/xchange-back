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
  source: String,
  order: Number,
})

const Currency = mongoose.model('currency', CurrenciesSchema, 'currency')

const getRate = async (firstCurrencyId, secondCurrencyId) => {
  const first = await Currency.find({name: firstCurrencyId})
  const second = await Currency.find({name: secondCurrencyId})
  if (!first[0] || !second[0]) return null
  return first[0].price_usd / second[0].price_usd
}
module.exports = {Currency, CurrenciesSchema, getRate}
