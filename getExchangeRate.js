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
    icon: 'Bitcoin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'ethereum',
    name: 'ethereum',
    icon: 'Ethereum',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'ripple',
    name: 'ripple',
    icon: 'XRP',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    icon: 'Bitcoin Cash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'eos',
    name: 'eos',
    icon: 'EOS',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'stellar',
    name: 'stellar',
    icon: 'Stellar',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'litecoin',
    name: 'litecoin',
    icon: 'Litecoin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'tether',
    name: 'tether',
    icon: 'Tether',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'cardano',
    name: 'cardano',
    icon: 'Cardano',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'monero',
    name: 'monero',
    icon: 'Monero',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'tron',
    name: 'tron',
    icon: 'TRON',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'dash',
    name: 'dash',
    icon: 'Dash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'iota',
    name: 'iota',
    icon: 'IOTA',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'binance-coin',
    name: 'binance-coin',
    icon: 'Binance Coin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'nem',
    name: 'nem',
    icon: 'NEM',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'zcash',
    name: 'zcash',
    icon: 'Zcash',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'dogecoin',
    name: 'dogecoin',
    icon: 'Dogecoin',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'omisego',
    name: 'omisego',
    icon: 'OmiseGO',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'lisk',
    name: 'lisk',
    icon: 'Lisk',
    reserve: '10000',
    minimal: '1',
    base: '',
  },
  {
    id: 'sberRu',
    name: 'Сбербанк руб',
    icon: 'Sberbank',
    label: 'RUR',
    reserve: '10000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'sberUsd',
    name: 'Сбербанк доллар',
    icon: 'Sberbank',
    label: 'USD',
    reserve: '10000',
    minimal: '1',
    base: 'usd',
  },
  {
    id: 'alfaRu',
    name: 'Альфа банк',
    icon: 'Alfabank',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'tinkoff',
    name: 'Тинькофф',
    icon: 'Tinkoff',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'VTB',
    name: 'ВТБ',
    icon: 'VTB',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'PMS',
    name: 'Промсвязьбанк',
    icon: 'PMS',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'qiwi',
    name: 'QIWI',
    icon: 'Qiwi',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
  },
  {
    id: 'ym',
    name: 'Яндекс.Деньги',
    icon: 'Yandex',
    label: 'RUR',
    reserve: '1000000',
    minimal: '1',
    base: 'Ruble',
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
    icon: 'sberbank ruble',
    label: 'RUR',
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
