const passport = require('passport')
const middleware = require('../authentication/middleware')

function initUser (app) {
  app.get('/', middleware.authenticationProhibited(), renderWelcome)
  app.get('/profile', middleware.authenticationRequired(), renderProfile)
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: 'what are you doing?',
  }))
  app.post('/logout', function(req, res) {
    req.logout()
    res.redirect('/');
  });
}

function renderWelcome (req, res) {
  res.render('user/welcome')
}

function renderProfile (req, res) {
  res.render('user/profile', {
    username: req.user.username
  })
}

module.exports = initUser
