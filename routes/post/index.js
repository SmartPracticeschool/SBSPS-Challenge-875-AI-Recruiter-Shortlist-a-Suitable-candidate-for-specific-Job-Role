const { bgBlueBright } = require('chalk')
const path = require('path')
const marked = require('marked')
const mv = require('mv')
const mime = require('mime-types')
const router = require('express').Router()
const { v4 } = require('uuid')
const _ = require('underscore')
const formParser = require('../../utils/parsers/form-parser')
const { Application, Company, Job, Post, User } = require('../../models')

const validFileTypes = ['png', 'jpeg', 'gif', 'jpg', 'mov', 'mp4']

router.get('/upload', (req, res, next) => {
  res.render('post/upload', {
    title: req.app.config.name,
    user: req.session.user
  })
})

router.post('/upload', formParser, async (req, res, next) => {
  let finalLocation, mimetype
  const randomId = v4()

  if (req.files.filetoupload.name) {
    const oldpath = req.files.filetoupload.path
    const type = req.files.filetoupload.name.split('.').slice(-1)[0].toLowerCase()
    if (!validFileTypes.includes(type)) {
      return res.status(403).render('error', {
        error: new Error('Unsupported file format!')
      })
    }
    const newpath = path.join(__dirname, '..', '..', 'public', 'feeds', `${req.session.user._id}_${randomId}.${type}`)
    finalLocation = `/feeds/${req.session.user._id}_${randomId}.${type}`

    mimetype = mime.lookup(req.files.filetoupload.name).split('/')[1]
    mv(oldpath, newpath, (error) => {
      if (error) {
        console.log(error)
      }
    })
  }

  const newPost = new Post({
    author: req.session.user._id,
    staticUrl: finalLocation,
    caption: req.body.caption,
    category: req.body.type,
    type: mimetype,
    createdAt: new Date(),
    onModel: req.session.user.usertype === 'user' ? 'User' : 'Company'
  })

  try {
    await newPost.save()
  } catch (error) {
    return res.status(500).render('error', {
      error: new Error('Failed to save post. Please try again!')
    })
  }

  let user

  if (req.session.user.usertype === 'user') {
    user = await User.findById(req.session.user._id).exec()
  } else {
    user = await Company.findById(req.session.user._id).exec()
  }

  user.posts.push(newPost._id)
  await user.save()
  console.log(bgBlueBright('Post saved successfully'))
  res.redirect('/')
})

router.get('/delete/:id', async (req, res, next) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id })
  } catch (error) {
    res.status(500).render('error', {
      error: new Error('Error deleting post.')
    })
  }

  let user
  if (req.session.user.usertype === 'user') {
    user = await User.findById(req.session.user._id).exec()
  } else {
    user = await Company.findById(req.session.user._id).exec()
  }

  user.posts = _.without(user.posts, post => post._id.equals(req.params.id))
  await user.save()

  res.redirect('/')
})

router.get('/job', (req, res, next) => {
  if (req.session.user.usertype !== 'company') {
    return res.status(403).render('error', {
      error: new Error('Forbidden')
    })
  } else {
    res.render('post/job', {
      title: req.app.config.name,
      user: req.session.user
    })
  }
})

router.post('/job', async (req, res, next) => {
  const skills = _.map(req.body.skills.split(','), (skill) => skill.trim().toLowerCase())
  const job = new Job({
    company: req.session.user._id,
    role: req.body.role,
    experience: req.body.experience,
    skills,
    description: req.body.description,
    pay: req.body.pay
  })

  const user = await Company.findById(req.session.user._id).exec()
  user.jobListings.push(job._id)
  try {
    await job.save()
  } catch (error) {
    return res.status(500).render('error', {
      error: new Error('Failed to upload job. Please try again!')
    })
  }

  await user.save()

  console.log(bgBlueBright('Job uploaded successfully'))
  return res.redirect('/?' + Date.now().toString().substring(0, 5))
})

router.get('/job/list', async (req, res, next) => {
  if (req.session.user.type === 'company') {
    res.status(403).render('error', {
      error: new Error('Forbidden')
    })
  }
  let jobs = await Job.find({ hiring: true }).populate('company').lean().exec()

  jobs = _.each(jobs, job => {
    job.description = marked(job.description)
  })

  res.render('jobs/index', {
    title: req.app.config.title,
    user: req.session.user,
    jobs: jobs.reverse()
  })
})

router.get('/job/apply/:id', async (req, res, next) => {
  if (req.session.user.usertype === 'company') {
    return res.status(403).render('error', {
      error: new Error('Forbidden')
    })
  }

  const hasApplied = await Application.findOne({ _id: req.params.id, by: req.session.user._id }).exec()

  if (hasApplied) {
    res.status(403).render('error', {
      error: new Error('You have already completed this sound. It may take sometime till the company gets back to you. Please stay tuned.')
    })
  }

  res.render('chat/bot', {
    title: req.app.config.title,
    user: req.session.user
  })
})

module.exports = router
