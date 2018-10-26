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
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})

passport.use(
  'loginUsers',
  new LocalStrategy((login, password, done) => {
    console.log(login)
    User.findOne({login})
      .then(user => {
        if (user.validPassword(password)) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  }),
)

var strategy = new Strategy(params, ({id}, done) => {
  const User = mongoose.model('login')
  console.log('from passport', id)
  User.find({id})
    .then(
      user =>
        user
          ? done(null, {id: user.id, ...user})
          : done(new Error('User not found'), null),
    )
    .catch(err => {
      console.log(err)
      done(err)
    })
})

passport.use(strategy)
