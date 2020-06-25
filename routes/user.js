const router = require('express').Router()
const { User, Company } = require('../models')

router.get('/', async (req, res, next) => {
  let users, companies
  try {
    users = await User.find({}).exec()
  } catch (error) {
    res.status(500).render('error', {
      error: new Error('An error was encountered while fetching all users.')
    })
  }
  try {
    companies = await Company.find({}).exec()
  } catch (error) {
    res.status(500).render('error', {
      error: new Error('An error was encountered while fetching all companies')
    })
  }
  res.render('user/list', {
    title: req.app.config.name,
    users,
    companies
  })
})

router.get('/user/@:username', async (req, res, next) => {
  let user
  try {
    user = await User.findOne({ username: req.params.username })
  } catch (error) {
    res.status(500).send({ message: 'Database error!' })
  }

  if (!user) {
    return res.status(404).render('error', {
      error: new Error('No user found with that username.')
    })
  }

  res.render('user/user-profile', {
    title: req.app.config.title,
    user
  })
})

router.get('/company/@:username', async (req, res, next) => {
  let company
  try {
    company = await Company.find({ username: req.params.username }).exec()
  } catch (error) {
    res.status(500).send({ message: 'Database error!' })
  }

  if (!company) {
    return res.status(404).render('error', {
      error: new Error('No user found with that username.')
    })
  }

  res.render('user/company-profile', {
    title: req.app.config.title,
    company
  })
})

module.exports = router
