const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const config = require('../config/config')

module.exports.getInfo = function(req, res) {
  const {id} = req.payload
  const User = mongoose.model('login')
  User.find({_id: id})
    .then(data => {
      const {wallets, lastOperations, username, email, login} = data[0]
      res.json({wallets, lastOperations, username, email, login})
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

module.exports.signup = function(req, res) {
  const User = mongoose.model('login')
  const {username, login, password, email} = req.body
  User.findOne({login})
    .then(user => {
      if (user) {
        res.status(400).json({err: 'User exist', errCode: 2})
      } else {
        const newUser = new User()
        newUser.login = login
        newUser.username = username
        newUser.email = email
        newUser.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
        newUser
          .save()
          .then(user => {
            req.logIn(user, function(err) {
              if (err) {
                return err
              }
              const payload = {
                id: user._id,
              }
              const token = jwt.encode(payload, config.secret) // line 10 passport-config

              return res.status(201).json({token})
            })
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => {
      res.status(400).json({err: err.message})
    })
}
