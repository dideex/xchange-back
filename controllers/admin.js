const mongoose = require('mongoose')

module.exports.getTotalOrders = (req, res) => {
  const {id} = req.payload
  const User = mongoose.model('login')
  const Orders = mongoose.model('order')
  User.findOne({_id: id}).then(({isAdmin}) => {
    if (!isAdmin) res.status(404).json({error: 'have no permission'})
    else {
      const {status} = req.params
      switch (status) {
        case 'all':
          Orders.find({paymentStatus: {$ne: 4}}).then(data =>
            res.status(200).json(data),
          )
          break
        case 'closed':
          Orders.find({paymentStatus: 3}).then(data =>
            res.status(200).json(data),
          )
          break
        case 'expectation':
          Orders.find({paymentStatus: 2}).then(data =>
            res.status(200).json(data),
          )
          break
        case 'created':
          Orders.find({paymentStatus: 1}).then(data =>
            res.status(200).json(data),
          )
          break
        case 'denied':
          Orders.find({paymentStatus: 4}).then(data =>
            res.status(200).json(data),
          )
          break

        default:
          res.status(200).json({success: true})
          break
      }
    }
  })
}

module.exports.summaryOrderUserInfo = (req, res) => {
  const {id} = req.payload
  const User = mongoose.model('login')
  User.findOne({_id: id}).then(({isAdmin}) => {
    if (!isAdmin) res.status(404).json({error: 'have no permission'})
    else {
      const {id} = req.params
      User.findOne({_id: id}).then(({email, username, fullname, wallets, login}) => {
        if (!login) res.status(200).json({error: 'user not found'})
        else {
          res.status(200).json({email, username, fullname, wallets, login})}
      })
    }
  })
}
