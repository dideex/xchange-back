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
          Orders.find({paymentStatus: {$ne: 4}})
            .sort([['created', -1]])
            .then(data => res.status(200).json(data))
          break
        case 'closed':
          Orders.find({paymentStatus: 3})
            .sort([['created', -1]])
            .then(data => res.status(200).json(data))
          break
        case 'expectation':
          Orders.find({paymentStatus: 2})
            .sort([['created', -1]])
            .then(data => res.status(200).json(data))
          break
        case 'created':
          Orders.find({paymentStatus: 1})
            .sort([['created', -1]])
            .then(data => res.status(200).json(data))
          break
        case 'denied':
          Orders.find({paymentStatus: 4})
            .sort([['created', -1]])
            .then(data => res.status(200).json(data))
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
      User.findOne({_id: id}).then(
        ({email, username, fullname, wallets, login}) => {
          if (!login) res.status(200).json({error: 'user not found'})
          else {
            res.status(200).json({email, username, fullname, wallets, login})
          }
        },
      )
    }
  })
}

module.exports.summaryOrderChangeStatus = (req, res) => {
  const {id} = req.payload
  const {_id, paymentStatus} = req.body
  const User = mongoose.model('login')
  const Orders = mongoose.model('order')
  User.findOne({_id: id}).then(({isAdmin}) => {
    if (!isAdmin) res.status(404).json({error: 'have no permission'})
    Orders.findOneAndUpdate({_id}, {paymentStatus}).then(data => {
      if (data) res.status(200).json({success: true})
      else res.status(404).json({error: 'server error'})
    })
  })
}

module.exports.setCurrencyOptions = (req, res) => {
  const {id} = req.payload
  const {_id, reserve, source, minimal} = req.body
  const User = mongoose.model('login')
  const Currency = mongoose.model('currency')
  User.findOne({_id: id}).then(({isAdmin}) => {
    if (!isAdmin) res.status(404).json({error: 'have no permission'})
    Currency.findOneAndUpdate({_id}, {reserve, source, minimal}).then(data => {
      if (data) res.status(200).json({success: true})
      else res.status(404).json({error: 'server error'})
    })
  })
}
