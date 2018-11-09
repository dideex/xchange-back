const express = require('express')
const bodyParser = require('body-parser')
// const jwt = require('jwt-simple')
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
