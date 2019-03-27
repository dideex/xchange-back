const mongoose = require('mongoose')
const mongoConfig = require('../config').mongodb
console.log('TCL: mongoConfig', mongoConfig)

module.exports = mongoose.connect(mongoConfig, {useNewUrlParser: true})
