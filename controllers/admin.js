const mongoose = require('mongoose')
const sendEmail = require('../utils/sendEmail')

module.exports.getTotalOrders = (req, res) => {
  const {id} = req.payload
  const User = mongoose.model('login')
  const Orders = mongoose.model('order')
  User.findOne({_id: id})
    .then(({isAdmin}) => {
      if (!isAdmin)
        res.status(401).json({err: 'У вас недостаточно доступа', errCode: 11})
      else {
        const {status} = req.params
        switch (status) {
          case 'all':
            Orders.find({paymentStatus: {$ne: 4}})
              .sort([['created', -1]])
              .then(data => res.status(200).json(data))
              .catch(() =>
                res
                  .status(401)
                  .json({
                    err: 'Ошибка сервера управления, транзакции не найдено',
                    errCode: 12,
                  }),
              )
            break
          case 'closed':
            Orders.find({paymentStatus: 3})
              .sort([['created', -1]])
              .then(data => res.status(200).json(data))
              .catch(() =>
                res
                  .status(401)
                  .json({
                    err: 'Ошибка сервера управления, транзакции не найдено',
                    errCode: 12,
                  }),
              )
            break
          case 'expectation':
            Orders.find({paymentStatus: 2})
              .sort([['created', -1]])
              .then(data => res.status(200).json(data))
              .catch(() =>
                res
                  .status(401)
                  .json({
                    err: 'Ошибка сервера управления, транзакции не найдено',
                    errCode: 12,
                  }),
              )
            break
          case 'created':
            Orders.find({paymentStatus: 1})
              .sort([['created', -1]])
              .then(data => res.status(200).json(data))
              .catch(() =>
                res
                  .status(401)
                  .json({
                    err: 'Ошибка сервера управления, транзакции не найдено',
                    errCode: 12,
                  }),
              )
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
    .catch(() =>
      res.status(401).json({err: 'Ошибка сервера управления', errCode: 10}),
    )
}

module.exports.summaryOrderUserInfo = (req, res) => {
  const {id} = req.payload
  const User = mongoose.model('login')
  User.findOne({_id: id})
    .then(({isAdmin}) => {
      if (!isAdmin)
        res.status(401).json({err: 'У вас недостаточно доступа', errCode: 11})
      else {
        const {id} = req.params
        User.findOne({_id: id})
          .then(({email, username, fullname, wallets, login}) => {
            if (!login) res.status(200).json({error: 'user not found'})
            else {
              res.status(200).json({email, username, fullname, wallets, login})
            }
          })
          .catch(() =>
            res
              .status(401)
              .json({err: 'Ошибка сервера управления', errCode: 10}),
          )
      }
    })
    .catch(() =>
      res.status(401).json({err: 'Ошибка сервера управления', errCode: 10}),
    )
}

module.exports.summaryOrderChangeStatus = (req, res) => {
  const {id} = req.payload
  const {_id, paymentStatus} = req.body
  const User = mongoose.model('login')
  const Orders = mongoose.model('order')
  User.findOne({_id: id})
    .then(({isAdmin}) => {
      if (!isAdmin)
        res.status(401).json({err: 'У вас недостаточно доступа', errCode: 11})
      Orders.findOneAndUpdate({_id}, {paymentStatus})
        .then(data => {
          if (data) {
            const {email} = data
            sendEmail.userSuccessNotificationByEmail(
              data.email,
              'http://localhost:3000/lichnii-kabinet/' + id,
            )
            res.status(200).json({success: true, ...data._doc, email})
          } else
            res
              .status(401)
              .json({err: 'Ошибка сервера управления', errCode: 10})
        })
        .catch(() =>
          res.status(401).json({err: 'Ошибка сервера управления', errCode: 10}),
        )
    })
    .catch(() =>
      res.status(401).json({err: 'Ошибка сервера управления', errCode: 10}),
    )
}

module.exports.setCurrencyOptions = (req, res) => {
  const {id} = req.payload
  const {_id, reserve, source, minimal} = req.body
  const User = mongoose.model('login')
  const Currency = mongoose.model('currency')
  User.findOne({_id: id}).then(({isAdmin}) => {
    if (!isAdmin)
      res.status(401).json({err: 'У вас недостаточно доступа', errCode: 11})
    Currency.findOneAndUpdate({_id}, {reserve, source, minimal})
      .then(data => {
        if (data) res.status(200).json({success: true})
        else
          res.status(401).json({err: 'Ошибка сервера управления', errCode: 10})
      })
      .catch(() =>
        res.status(401).json({err: 'Ошибка сервера управления', errCode: 10}),
      )
  })
}
