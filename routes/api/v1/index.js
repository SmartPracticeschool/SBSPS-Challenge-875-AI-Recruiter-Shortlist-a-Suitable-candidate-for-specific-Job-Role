const router = require('express').Router()
const ta = require('time-ago')
const _ = require('underscore')
const q = require('queue')({ autostart: true })
const Fuse = require('fuse.js')
const { Company, Post, User } = require('../../../models')

// Rate limiting
router.use(function (req, res, next) {
  q.push(async function () {
    next()
  })
})

router.use(function (req, res, next) {
  const date = new Date()
  const sessionDate = new Date(req.session.lastApi)
  if (sessionDate) {
    if (date - sessionDate < 2000) {
      setTimeout(function () {
        next()
        req.session.lastApi = date
      }, 1000)
    } else {
      next()
      req.session.lastApi = date
    }
  } else {
    req.session.lastApi = date
    next()
  }
})

router.get('/v1/search', async (req, res) => {
  const userOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['username', 'resume.basics.name', 'resume.basics.email']
  }

  const companyOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['username', 'name', 'email']
  }

  let users, companies
  try {
    users = await User.find({}).exec()
    companies = await Company.find({}).exec()
  } catch (error) {
    res.status(500).send({ message: 'Database error!' })
  }
  const userFuse = new Fuse(users, userOptions)
  const companyFuse = new Fuse(companies, companyOptions)

  if (!req.query || !req.query.q) {
    return res.send({
      users,
      companies
    })
  }

  return res.send({
    users: _.pluck(userFuse.search(req.query.q), 'item'),
    companies: _.pluck(companyFuse.search(req.query.q), 'item')
  })
})

router.get('/v1/posts', async (req, res) => {
  if (!req.session.user) {
    res.sendStatus(404)
  } else {
    const page = req.query.page || 1
    let posts
    try {
      posts = await Post.find().populate('author').populate('comments').populate('likes').lean().exec()
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }

    posts = _.sortBy(posts, (eachPost) => new Date(eachPost.createdAt)).reverse()
    posts = posts.slice(
      page === 1 ? 0 : 10 * (page - 1),
      page === 1 ? 10 : undefined
    )
    res.status(200).send(_.each(posts, post => {
      post.timeago = ta.ago(post.createdAt)
    }))
  }
})

router.get('/v1/notifications', async (req, res) => {
  let user
  try {
    if (req.session.user.usertype === 'user') {
      user = await User.findOne({ username: req.session.user.username }).exec()
    } else {
      user = await Company.findOne({ username: req.session.user.username }).exec()
    }
  } catch (error) {
    console.log(error)
  }
  if (user) {
    res.send(user.notifications.length.toString())
  }
})

router.get('/v1/notifications/markAsRead', async (req, res, next) => {
  let user
  try {
    if (req.session.user.usertype === 'user') {
      user = await User.findOne({ username: req.session.user.username }).exec()
    } else {
      user = await Company.findOne({ username: req.session.user.username }).exec()
    }
  } catch (error) {
    console.log(error)
  }
  if (user) {
    user.notifications = []
    await user.save()
    res.redirect('/me/activity')
  }
})

module.exports = router
