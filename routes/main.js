const chalk = require('chalk')
const router = require('express').Router()
const { User } = require('../models')

router.get('/', (req, res, next) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username })
      .exec((error, currentUser) => {
        if (error) {
          console.log(chalk.red(error))
          return res.render('error', { error: error })
        }
        res.render('index', {
          user: currentUser,
          title: req.app.config.title,
          events: req.app.events
        })
      })
  } else {
    res.render('land', {
      title: req.app.config.name,
      error: req.query.error || false
    })
  }
})

module.exports = router
