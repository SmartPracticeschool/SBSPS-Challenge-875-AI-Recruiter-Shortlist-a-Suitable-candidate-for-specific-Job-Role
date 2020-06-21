const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.render('land', {
    title: req.app.config.name,
    error: (req.query.error) || false
  })
})

module.exports = router
