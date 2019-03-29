const mongoose = require('mongoose')
const mongoConfig = require('../config').mongodb

module.exports = mongoose.connect(mongoConfig, {useNewUrlParser: true})
