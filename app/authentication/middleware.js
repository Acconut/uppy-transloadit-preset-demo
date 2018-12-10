function authenticationRequired () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
}

function authenticationProhibited() {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/profile')
  }
}

module.exports = {
  authenticationRequired,
  authenticationProhibited
}
