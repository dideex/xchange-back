const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
const orders = require('../controllers/orders')
const passport = require('passport')

const auth = passport.authenticate('jwt', {
  session: false,
})

router.get('/userData', auth, userData.getInfo)
router.post('/userData', auth, userData.updateInfo)
router.post('/signupUser', userData.signup)

router.get('/orders', auth, orders.getAuthOrders)

router.post('/orders', auth, orders.addOrder)
router.post('/guestOrders', orders.addGuestOrder)
router.post('/confirmOrder', orders.confirmOrder)


module.exports = router
