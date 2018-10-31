const mongoose = require('mongoose')
require('../models/currency')
const Currency = mongoose.model('currency')

module.exports.getCurrency = (req, res) => {
  Currency.find().then(
    currency =>
      currency
        ? res.status(200).json(currency)
        : res.status(500).json({err: 'DB error'}),
  )
}
