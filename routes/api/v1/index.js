const router = require('express').Router()
const { Company, Post, User } = require('../../../models')
const ta = require('time-ago')
const _ = require('underscore')

router.get('/v1/posts', async (req, res) => {
  if (!req.session.user) {
    res.sendStatus(404)
  } else {
    const page = req.query.page || 1
    let posts
    try {
      posts = await Post.find().populate('author').populate('comments').populate('likes').exec()
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }

    _.each(posts, (eachPost) => {
      eachPost.timeago = ta.ago(eachPost.createdAt)
    })

    posts = _.sortBy(posts, (eachPost) => new Date(eachPost.createdAt)).reverse()
    posts = posts.slice(
      page === 1 ? 0 : 10 * (page - 1),
      page === 1 ? 10 : undefined
    )
    console.log('Working')
    res.status(200).send(posts)
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
    if(req.session.user.usertype === 'user') {
      user = await User.findOne({ username: req.session.user.username }).exec()
    } else {
      user = await Company.findOne({ username: req.session.user.username }).exec()
    }
  } catch (error) {
    console.log(error)
  }
  if  (user) {
    user.notifications = []
    await user.save()
    res.redirect('/me/activity')
  }
})

module.exports = router
