const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
var passport = require('passport')

const auth = passport.authenticate('jwt', {
  session: false,
})

router.get('/userData', auth, userData.getInfo)
module.exports = router
