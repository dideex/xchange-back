const mongoose = require('mongoose')
const fetch = require('node-fetch')
const {rateExchange} = require('./config/config.json')

require('./models/currency')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/xchange',
  {useMongoClient: true},
)

const Currency = mongoose.model('currency')

const mockData = [
  {
    id: 'bitcoin',
    name: 'bitcoin',
    icon: 'Bitcoin',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 1,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'ethereum',
    name: 'ethereum',
    icon: 'Ethereum',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 2,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'ripple',
    name: 'ripple',
    icon: 'XRP',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 4,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    icon: 'Bitcoin Cash',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 5,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'eos',
    name: 'eos',
    icon: 'EOS',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 7,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'stellar',
    name: 'stellar',
    icon: 'Stellar',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 8,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'litecoin',
    name: 'litecoin',
    icon: 'Litecoin',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 10,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'tether',
    name: 'tether',
    icon: 'Tether',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 11,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'cardano',
    name: 'cardano',
    icon: 'Cardano',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 13,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'monero',
    name: 'monero',
    icon: 'Monero',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 14,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'tron',
    name: 'tron',
    icon: 'TRON',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 16,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'dash',
    name: 'dash',
    icon: 'Dash',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 17,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'iota',
    name: 'iota',
    icon: 'IOTA',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 19,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'binance-coin',
    name: 'binance-coin',
    icon: 'Binance Coin',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 20,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'nem',
    name: 'nem',
    icon: 'NEM',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 22,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'zcash',
    name: 'zcash',
    icon: 'Zcash',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 23,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'dogecoin',
    name: 'dogecoin',
    icon: 'Dogecoin',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 25,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'omisego',
    name: 'omisego',
    icon: 'OmiseGO',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 26,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'lisk',
    name: 'lisk',
    icon: 'Lisk',
    // reserve: '10000',
    // minimal: '1',
    base: '',
    order: 28,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'sberRu',
    name: 'Сбербанк руб',
    icon: 'Sberbank',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 3,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'sberUsd',
    name: 'Сбербанк usd',
    icon: 'Sberbank',
    label: 'USD',
    // reserve: '1000000',
    // minimal: '1',
    base: 'usd',
    order: 6,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'alfaRu',
    name: 'Альфа банк',
    icon: 'Alfabank',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 9,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'tinkoff',
    name: 'Тинькофф',
    icon: 'Tinkoff',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 12,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'VTB',
    name: 'ВТБ',
    icon: 'VTB',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 15,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'PMS',
    name: 'Промсвязьбанк',
    icon: 'PMS',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 18,
    // source: '1234 4321 1234 4321',
    mask: '____ ____ ____ ____',
  },
  {
    id: 'qiwi',
    name: 'QIWI',
    icon: 'Qiwi',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 21,
    // source: '1234 4321 1234 4321',
  },
  {
    id: 'ym',
    name: 'Яндекс.Деньги',
    icon: 'Yandex',
    label: 'RUR',
    // reserve: '1000000',
    // minimal: '1',
    base: 'Ruble',
    order: 24,
    // source: '1234 4321 1234 4321',
  },
]

const createTotalSchema = () =>
  Promise.all(
    mockData.map(currency =>
      Currency.update(
        {id: currency.id},
        {$set: currency},
        {upsert: true},
        () => {},
      ),
    ),
  )

const fetchCrypto = async () =>
  await fetch('https://api.coinmarketcap.com/v1/ticker/')
    .then(response => response.json())
    .then(data => {
      const filteredData = data.map(currency => ({
        ...currency,
        label: currency.symbol,
        change: currency.percent_change_24h,
        type: 'crypto',
      }))

      return Promise.all(
        filteredData.map(
          row =>
            new Promise(res =>
              Currency.update({id: row.id}, {$set: row}, () => res()),
            ),
        ),
      )
    })

const fetchValutes = () =>
  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(({Valute}) => {
      const data = {} // 440 322,119 x 1    / 6 475,563 x 1    7 123,12 x 1    5 886,876 x 1
      const rublPrice = (1 / Valute.USD.Value) * rateExchange // 1 / 67.9975
      const rublPricePrev = 1 / Valute.USD.Previous
      const bases = ['Ruble', 'Euro', 'usd']

      data['Ruble'] = {
        base: 'Ruble',
        price_usd: rublPrice,
        change: rublPricePrev - rublPrice,
      }
      data['Euro'] = {
        base: 'Euro',
        price_usd: (Valute.EUR.Value / Valute.USD.Value) * rateExchange,
        change: Valute.EUR.Previous - Valute.EUR.Value,
      }
      data['usd'] = {
        base: 'usd',
        price_usd: 1 * rateExchange,
        change: 0,
      }

      bases.forEach(base =>
        Currency.update(
          {base: base},
          {$set: {...data[base]}},
          {multi: true},
          () => {},
        ),
      )
    })

createTotalSchema().then(() =>
  fetchValutes().then(() => fetchCrypto().then(() => process.exit(0))),
)
// updateTotalSchema().then(() => fetchCrypto().then(() => fetchValutes()))
// fetchCrypto()
