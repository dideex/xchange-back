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

router.get('/userData', auth, userData.getInfo) // postman
router.post('/userData', auth, userData.updateInfo) // done postman

router.post('/signinUser', userData.signin) // done  postman
router.post('/signupUser', userData.signup) // done  postman

router.get('/order', orders.getGuestOrder) // postman

router.get('/currency', currency.getCurrency) // postman

router.get('/token', auth, userData.checkToken) // postman

router.get('/orders', auth, orders.getAuthOrders) // postman
router.post('/orders', auth, orders.addOrder) // done  postman
router.post('/guestOrders', orders.addGuestOrder) // done postman
router.post('/confirmOrder', orders.confirmOrder) // done postman

router.post('/sendMessage', orders.sendEmail) // done postman

router.get('/summaryOrders', auth, admin.getTotalOrders) // postman
router.get('/summaryOrders/:status', auth, admin.getTotalOrders) // postman
router.get('/summaryOrderUserInfo/:id', auth, admin.summaryOrderUserInfo) // postman

router.post('/summaryOrderChangeStatus', auth, admin.summaryOrderChangeStatus) // none postman
router.post('/setCurrencyOptions', auth, admin.setCurrencyOptions) // none postman


module.exports = router
