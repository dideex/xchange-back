const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const config = require('./config/config')
const routerApi = require('./routes/api')
const cors = require('cors')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/jwt',
  {useMongoClient: true},
)

require('./models/user')

const app = express()

app.use(cors())
app.use(logger('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
app.use(
  session({
    secret: config.session,
    key: 'keys',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
  }),
)

require('./config/passport-config')
app.use(passport.initialize({userProperty: 'payload'}))
app.use(passport.session())

app.post('/token', function(req, res, next) {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).send({error: 'Укажите правильный логин и пароль!'})
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
  })(req, res, next)
})

app.use('/api', routerApi)

app.use((req, res, next) => {
  res.status(404).json({err: '404'})
})

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).json({err: '500'})
})

app.listen(3030, function() {
  console.log('Server running. Use our API 3030')
})
