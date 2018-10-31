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
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'ethereum',
    name: 'ethereum',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'ripple',
    name: 'ripple',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'eos',
    name: 'eos',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'stellar',
    name: 'stellar',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'litecoin',
    name: 'litecoin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'tether',
    name: 'tether',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'cardano',
    name: 'cardano',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'monero',
    name: 'monero',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'tron',
    name: 'tron',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'dash',
    name: 'dash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'iota',
    name: 'iota',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'binance-coin',
    name: 'binance-coin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'nem',
    name: 'nem',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'zcash',
    name: 'zcash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'dogecoin',
    name: 'dogecoin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'omisego',
    name: 'omisego',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'lisk',
    name: 'lisk',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'sberRu',
    name: 'sberbank ruble',
    label: 'Ru',
    reserve: '10000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'alfaRu',
    name: 'Alfa bank ruble',
    label: 'Ru',
    reserve: '10000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'sberEu',
    name: 'sberbank eu',
    label: 'Euro',
    reserve: '10000',
    minimal: '1',
    base: 'Euro',
  },
  {
    id: 'sberUsd',
    name: 'sberbank USD',
    label: 'usd',
    reserve: '10000',
    minimal: '1',
    base: 'usd',
  },
]

const createTotalSchema = () =>
  Promise.all(
    mockData.map(currency =>
      Currency.update(
        {id: currency.id},
        {$set: currency},
        {upsert: true},
        err => console.log(err),
      ),
    ),
  )

// const newCurrency = new Currency(mockData[0])
// return newCurrency.save()

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
    reserve: '10000',
    minimal: '1',
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
createTotalSchema().then(() => fetchValutes().then(() => fetchCrypto()))
// updateTotalSchema().then(() => fetchCrypto().then(() => fetchValutes()))
// fetchCrypto()
