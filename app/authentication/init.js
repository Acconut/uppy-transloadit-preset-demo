const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const db = require('../database')

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  db.findUser(username, cb)
})

function initPassport () {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      db.findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          return done(null, false)
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
  ))
}

module.exports = initPassport
