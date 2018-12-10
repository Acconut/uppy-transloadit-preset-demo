const passport = require('passport')
const middleware = require('../authentication/middleware')
const db = require('../database')

function initUser (app) {
  app.get('/', middleware.authenticationProhibited(), renderLogin)
  app.get('/signup', middleware.authenticationProhibited(), renderSignup)
  app.get('/profile', middleware.authenticationRequired(), renderProfile)
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: 'The username and password combination did not match',
  }))
  app.post('/signup', middleware.authenticationProhibited(), function(req, res, next) {
    const username = req.body.username
    const password1 = req.body.password
    const password2 = req.body['password-repeated']

    if(!username) {
      req.flash('error', 'Please enter an username')
    } else if(!password1 || !password2) {
      req.flash('error', 'Please enter a password and repeat it')
    } else if(password1 !== password2) {
      req.flash('error', 'Please repeat the same password')
    } else {
      db.createUser(username, password1, function(err) {
        if(err) return next(err)
        res.redirect('/')
      })
      return
    }

    res.redirect('/signup')
  })
  app.post('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })
}

function renderLogin (req, res) {
  res.render('user/login')
}

function renderSignup (req, res) {
  res.render('user/signup')
}

function renderProfile (req, res, next) {
  db.listUsers(function(err, users) {
    if(err) return next(err)

    res.render('user/profile', {
      users: users,
      username: req.user.username
    })
  })
}

module.exports = initUser
