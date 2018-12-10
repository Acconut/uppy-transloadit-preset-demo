const passport = require('passport')
const middleware = require('../authentication/middleware')
const db = require('../database')
const TransloaditClient = require('transloadit')
const config = require('../../config')

const transloadit = new TransloaditClient({
  authKey   : config.transloadit.key,
  authSecret: config.transloadit.secret
})

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

  app.post('/change-avatar', function(req, res, next) {
    if(!req.body.transloadit) {
      return res.redirect('/profile')
    }

    let url = null;
    try {
      const assembly = JSON.parse(req.body.transloadit)
      const results = assembly[0].results["resize_image"]
      url = results[0].ssl_url
    } catch(e) {
      req.flash('error', 'We were not able to receive the result from Transloadit: '+e.toString());
      res.redirect('/profile')
      return
    }

    db.setAvatarUrl(req.user.id, url, function(err) {
      if(err) return next(err);
      res.redirect('/profile')
    })
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
    if(err) return next(err);

    const { signature, params } = transloadit.calcSignature({
      template_id: config.transloadit.templateId
    })

    res.render('user/profile', {
      users: users,
      username: req.user.username,
      assemblySignature: signature,
      assemblyParams: JSON.stringify(params)
    })
  })
}

module.exports = initUser
