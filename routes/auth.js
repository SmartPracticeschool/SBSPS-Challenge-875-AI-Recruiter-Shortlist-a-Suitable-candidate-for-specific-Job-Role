const router = require('express').Router()

router.get('/new/user/info', (req, res, next) => {
  res.render('auth/forms/user', {
    title: req.app.config.name
  })
})

router.post('/new/user/info', (req, res, next) => {
  res.status(200).send(req.body)
})

module.exports = router
