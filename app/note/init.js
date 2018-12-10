const middleware = require('../authentication/middleware')

function initUser (app) {
  app.get('/notes/:id', middleware.authenticationRequired(), (req, res) => {
    res.render('note/overview', {
      id: req.params.id
    })
  })
}

module.exports = initUser
