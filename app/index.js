const path = require('path')

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
const flash = require('connect-flash')

const config = require('../config')
const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))

require('./authentication').init(app)

app.use(cookieSession({
  name: 'session',
  keys: ["Tstgertgregert"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(flash())

app.use(function(req, res, next) {
  res.locals.error_message = req.flash('error');
  next();
})

app.use(passport.initialize())
app.use(passport.session())

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname)
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname))

require('./user').init(app)

module.exports = app
