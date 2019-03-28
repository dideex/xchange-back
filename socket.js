const mongoose = require('mongoose')
require('./models/RecentOperations')

mongoose.Promise = global.Promise
const mongoConfig = require('./config').mongodb
mongoose.connect(mongoConfig, {useMongoClient: true})
const Operation = mongoose.model('operations')

const io = require('socket.io')()
const port = 3040

const hashEmail = source => {
  const [hash, mail] = source.split('@')
  return `${hash[0]}${'*'.repeat(hash.slice(1, -1).length)}${
    hash[hash.length - 1]
  }@${mail}`
}

io.on('connection', client => {
  Operation.find({}).then(data => {
    client.send({type: 'init', data})
  })
  client.on('newOrder', _order => {
    const order = {..._order, email: hashEmail(_order.email)}

    Operation.find({}, null, {sort: {created: 1}}).then(async res => {
      if (res.length >= 3)
        await Operation.findOneAndRemove({created: res[0].created}, err => {})
      const operation = new Operation(order)
      operation.save().then(() => {
        client.broadcast.send({type: 'broadcast', order})
      })
    })
  })
})

io.listen(port)
