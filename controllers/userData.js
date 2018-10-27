const mongoose = require('mongoose')

module.exports.getInfo = function(req, res) {
  const {id} = req.payload
  const User = mongoose.model('login')
  User.find({_id: id})
    .then(data => {
      const {wallets, lastOperations, username, email} = data[0]
      res.json({wallets, lastOperations, username, email})
    })
    .catch(err => {
      res.status(400).json({err: err.message})
    })
}

module.exports.updateInfo = function(req, res) {
  const {id} = req.payload
  const {wallets, username, email} = req.body
  const User = mongoose.model('login')
  User.findOneAndUpdate({_id: id}, {wallets, username, email})
    .then(results => {
      if (results) {
        res.json(results)
      } else {
        res.status(400).json({err: 'Cat not found'})
      }
    })
    .catch(err => {
      res.status(400).json({err: err.message})
    })
}
