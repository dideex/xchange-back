const mongoose = require('mongoose')
require('../models/currency')
const Currency = mongoose.model('currency')
const {rateExchange} = require('../config/config.json')

module.exports.getCurrency = (req, res) => {
  Currency.find()
    .then(currency =>
      currency
        ? res.status(200).json({data: currency, userRate: rateExchange})
        : res.status(401).json({err: 'Ошибка сервера валют', errCode: 20}),
    )
    .catch(() =>
      res.status(401).json({err: 'Ошибка сервера валют', errCode: 20}),
    )
}
