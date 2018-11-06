const currency = require('./models/currency')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/jwt',
  {useMongoClient: true},
)

  currency.getRate('bitcoin', 'sberRu').then(res => console.log(res))