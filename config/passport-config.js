const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = mongoose.model('login')
const config = require('./config')
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

const params = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

passport.serializeUser((user, done) => {
  // console.log(' LOG ___ serialize ')
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // console.log(' LOG ___ deserialize ', id)
  User.findById(id, (err, user) => done(err, user))
})

passport.use(
  'loginUsers',
  new LocalStrategy((login, password, done) => {
    // console.log('loginUser', login)
    User.findOne({login})
      .then(
        user =>
          user.validPassword(password) ? done(null, user) : done(null, false),
      )
      .catch(err => {
        console.log(err)
        done(err)
      })
  }),
)

const strategy = new Strategy(params, (payload, done) => {
  const User = mongoose.model('login')
  console.log(' strategy ___ payload ', payload.id)
  User.find({_id: payload.id})
    .then(
      user =>
        user
          ? done(null, {id: payload.id})
          : done(new Error('User not found'), null),
    )
    .catch(err => {
      console.log('from strategy ', err)
      done(err)
    })
})

passport.use(strategy)
