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
router.post('/userData', auth, userData.updateInfo) // done

router.post('/signinUser', userData.signin) // done
router.post('/signupUser', userData.signup) // done

router.get('/order', orders.getGuestOrder)

router.get('/currency', currency.getCurrency)

router.get('/token', auth, userData.checkToken)

router.get('/orders', auth, orders.getAuthOrders)
router.post('/orders', auth, orders.addOrder) // done
router.post('/guestOrders', orders.addGuestOrder) // done
router.post('/confirmOrder', orders.confirmOrder) // done

router.post('/sendMessage', orders.sendEmail) // done

router.get('/summaryOrders', auth, admin.getTotalOrders)
router.get('/summaryOrders/:status', auth, admin.getTotalOrders)
router.get('/summaryOrderUserInfo/:id', auth, admin.summaryOrderUserInfo)

router.post('/summaryOrderChangeStatus', auth, admin.summaryOrderChangeStatus) // none
router.post('/setCurrencyOptions', auth, admin.setCurrencyOptions) // none


module.exports = router
