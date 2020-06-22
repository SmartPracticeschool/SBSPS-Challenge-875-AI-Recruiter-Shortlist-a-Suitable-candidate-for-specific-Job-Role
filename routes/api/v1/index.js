const router = require('express').Router()
const { Post } = require('../../../models')
const ta = require('time-ago')
const _ = require('underscore')

router.get('/v1/posts', async (req, res) => {
  if (!req.session.user) {
    res.sendStatus(404)
  } else {
    req.query.sort = req.query.sort.split(' ').length > 1
      ? req.query.sort.split(' ')[1]
      : req.query.sort
    const page = req.query.page || 1
    let posts = await Post.find().populate('author').populate('comments').populate('likes').execPopulate()

    _.each(posts, (eachPost) => {
      eachPost.timeago = ta.ago(eachPost.createdAt)
    })

    posts = _.sortBy(posts, (eachPost) => new Date(eachPost.createdAt)).reverse()
    posts = posts.slice(
      page === 1 ? 0 : 10 * (page - 1),
      page === 1 ? 10 : undefined
    )
    res.status(200).send(posts)
  }
})

module.exports = router
