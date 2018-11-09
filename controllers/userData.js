const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const config = require('../config/config')
const Orders = require('../models/orders')
const passport = require('passport')

module.exports.checkToken = function(req, res) {
  const {id} = req.payload
  if (id) res.status(200).json({success: true})
  else res.status(401).json({err: 'Ошибка сервера авторизации', errCode: 40})
}

module.exports.getInfo = function(req, res) {
  const {id} = req.payload
  const User = mongoose.model('login')
  User.find({_id: id})
    .then(async data => {
      const {wallets, lastOperations, username, email, login} = data[0]
      const convertedAmount = await Orders.getConvertedAmount(id)
      res.status(200).json({
        wallets,
        lastOperations,
        username,
        email,
        login,
        convertedAmount,
      })
    })
    .catch(() => {
      res.status(400).json({err: 'Ошибка сервера авторизации', errCode: 40})
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
        res.status(400).json({err: "Такой пользователь не найден", errCode: 47})
      }
    })
    .catch(err => {
      res.status(400).json({err: "Не удалось сохранить профиль", errCode: 41})
    })
}

module.exports.signup = function(req, res) {
  const User = mongoose.model('login')
  const {username, login, password, email} = req.body
  emailReg = new RegExp(
    `^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`,
  )

  if (!emailReg.test(email))
    return res.status(401).json({err: 'Введите email', errCode: 42})
  if (!password)
    return res.status(401).json({err: 'Введите пароль', errCode: 43})
  if (!username) return res.status(401).json({err: 'Введите ФИО', errCode: 44})
  if (!login) return res.status(401).json({err: 'Введите логин', errCode: 45})

  User.findOne({login})
    .then(user => {
      if (user) {
        res
          .status(400)
          .json({err: 'Пользователь с таким именем уже существует', errCode: 46})
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
          .catch(() => res
            .status(400)
            .json({err: 'Ошибка сервера авторизации', errCode: 40}))
      }
    })
    .catch(() => {
      res.status(400).json({err: 'Ошибка сервера авторизации', errCode: 40})
    })
}

module.exports.signin = (req, res) => {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).send({err: 'Укажите логин и пароль', errCode: 48})
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      const payload = {
        id: user._id,
      }
      const token = jwt.encode(payload, config.secret)

      if (user.isAdmin) res.json({token, isAdmin: true})
      else res.json({token})
    })
  })(req, res)
}
