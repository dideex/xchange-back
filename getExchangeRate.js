const mongoose = require('mongoose')
const fetch = require('node-fetch')

require('./models/currency')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/jwt',
  {useMongoClient: true},
)

const Currency = mongoose.model('currency')

const mockData = [
  {
    id: 'bitcoin',
    name: 'bitcoin',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'ethereum',
    name: 'ethereum',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'ripple',
    name: 'ripple',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'eos',
    name: 'eos',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'stellar',
    name: 'stellar',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'litecoin',
    name: 'litecoin',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'tether',
    name: 'tether',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'cardano',
    name: 'cardano',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'monero',
    name: 'monero',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'tron',
    name: 'tron',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'dash',
    name: 'dash',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'iota',
    name: 'iota',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'binance-coin',
    name: 'binance-coin',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'nem',
    name: 'nem',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'zcash',
    name: 'zcash',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'dogecoin',
    name: 'dogecoin',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'omisego',
    name: 'omisego',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'lisk',
    name: 'lisk',
    reserved: '10000',
    minimum: '10000',
    base: '',
  },
  {
    id: 'sberRu',
    name: 'sberbank ruble',
    label: 'Ru',
    reserved: '10000',
    minimum: '10000',
    base: 'Ruble',
  },
  {
    id: 'alfaRu',
    name: 'Alfa bank ruble',
    label: 'Ru',
    reserved: '10000',
    minimum: '10000',
    base: 'Ruble',
  },
  {
    id: 'sberEu',
    name: 'sberbank eu',
    label: 'Euro',
    reserved: '10000',
    minimum: '10000',
    base: 'Euro',
  },
  {
    id: 'sberUsd',
    name: 'sberbank USD',
    label: 'usd',
    reserved: '10000',
    minimum: '10000',
    base: 'usd',
  },
]

const createTotalSchema = () => {
  mockData.forEach(currency =>
    Currency.update({id: currency.id}, {$set: currency}, {upsert: true}, err =>
      console.log(err),
    ),
  )

  // const newCurrency = new Currency(mockData[0])
  // return newCurrency.save()
}


// Currency.update(
//   {'entities.name': 'Bitcoin'},
//   {$set: {'entities.$.name': 'name'}},
//   err => console.log(err),
// )
const fetchCrypto = () =>
  fetch('https://api.coinmarketcap.com/v1/ticker/')
    .then(response => response.json())
    .then(data => {
      const filteredDara = data.map(currency => ({
        ...currency,
        label: currency.symbol,
        change: currency.percent_change_24h,
        type: 'crypto',
      }))
      // Currency.find({'entities.id': {$exists: true}}).then(data => {
      //   // if (!data[0]) createTotalSchema()
      // })
      filteredDara.map(row => {
        Currency.update({id: row.id}, {$set: row}, () => {})
        // Currency.update({id: row.id}, {$push: {...row}}, () => console.log('done'))
        // const newCurrency = new Currency({row})
        // newCurrency.save().then(() => console.log('done'))
      })
    })

const fetchValutes = () =>
  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(({Valute}) => {
      const data = {}
      const rublPrice = 1 / Valute.USD.Value
      const rublPricePrev = 1 / Valute.USD.Previous
      const bases = ['Ruble', 'Euro', 'usd']

      data['Ruble'] = {
        base: 'Ruble',
        price_usd: rublPrice,
        change: rublPricePrev - rublPrice,
      }
      data['Euro'] = {
        base: 'Euro',
        price_usd: Valute.EUR.Value / Valute.USD.Value,
        change: Valute.EUR.Previous - Valute.EUR.Value,
      }
      data['usd'] = {
        base: 'usd',
        price_usd: 1,
        change: 0,
      }

      /* 
  {
    id: 'sberRu',
    name: 'sberbank ruble',
    label: 'Ru',
    reserved: '10000',
    minimum: '10000',
    base: 'Ruble',
  }, */
      bases.forEach(base =>
        Currency.update(
          {base: base},
          {$set: {...data[base]}},
          {multi: true},
          () => {},
        ),
      )

      // Currency.find({'id': 'sberRu'}, (err, doc) => {}).then(u =>
      //   console.log(u),
      // )

      // Currency.update({}, {$push: {entities: data[0]}}, err => console.log(err))
      // Currency.update({}, {$push: {entities: data[1]}}, err => console.log(err))

      // Currency.find({'realCash.id': {$exists: true}}).then(result => {
      //   const newCurrency = new Currency({realCash: [...data]})
      //   if (!result[0]) newCurrency.save()
      // })

      // data.map(row => {
      //   Currency.findOne({'realCash.id': row.id}).then(
      //     currency =>
      //       currency
      //         ? Currency.update(
      //             {'realCash.id': row.id},
      //             {$set: {'realCash.$': row}},
      //             () => {},
      //           )
      //         : Currency.update({}, {$push: {realCash: row}}, () => {}),
      //   )
      // })
    })
// createTotalSchema()
fetchValutes().then(() => fetchCrypto())
// updateTotalSchema().then(() => fetchCrypto().then(() => fetchValutes()))
// fetchCrypto()
