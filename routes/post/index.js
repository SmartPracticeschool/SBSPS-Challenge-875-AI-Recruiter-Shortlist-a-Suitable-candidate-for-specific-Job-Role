const { bgBlueBright } = require('chalk')
const path = require('path')
const mv = require('mv')
const mime = require('mime-types')
const router = require('express').Router()
const { v4 } = require('uuid')
const formParser = require('../../utils/parsers/form-parser')
const { Job, Post } = require('../../models')

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

  res.redirect('/')
})

router.get('/job', (req, res, next) => {
  res.render('post/job', {
    title: req.app.config.name,
    user: req.session.user
  })
})

router.post('/job', async (req, res, next) => {
  const newJob = new Job({
    role: req.body.role,
    experience: req.body.experience,
    skills: req.body.skills,
    description: req.body.description,
    pay: req.body.pay
  })

  try {
    await newJob.save()
  } catch (error) {
    return res.status(500).render('error', {
      error: new Error('Failed to upload job. Please try again!')
    })
  }
  console.log(bgBlueBright('Job uploaded successfully'))
  res.redirect('/')
})

module.exports = router
