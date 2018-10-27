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
