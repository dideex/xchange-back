const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
const orders = require('../controllers/orders')
const currency = require('../controllers/currency')
const admin = require('../controllers/admin')
const passport = require('passport')

const auth = passport.authenticate('jwt', {
  session: false,
})

router.get('/userData', auth, userData.getInfo)
router.post('/userData', auth, userData.updateInfo)
router.post('/signupUser', userData.signup)

router.get('/order', orders.getGuestOrder)

router.get('/currency', currency.getCurrency)

router.get('/orders', auth, orders.getAuthOrders)
router.post('/orders', auth, orders.addOrder)
router.post('/guestOrders', orders.addGuestOrder)
router.post('/confirmOrder', orders.confirmOrder)

router.post('/sendMessage', orders.sendEmail)

router.get('/summaryOrders', auth, admin.getTotalOrders)
router.get('/summaryOrders/:status', auth, admin.getTotalOrders)
router.get('/summaryOrderUserInfo/:id', auth, admin.summaryOrderUserInfo)


module.exports = router
