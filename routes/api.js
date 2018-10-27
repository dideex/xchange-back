const express = require('express')
const router = express.Router()
const userData = require('../controllers/userData')
var passport = require('passport')

const auth = passport.authenticate('jwt', {
  session: false,
})

router.get('/userData', auth, userData.getInfo)

router.post('/userData', auth, userData.updateInfo)


module.exports = router
