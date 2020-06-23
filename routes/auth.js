const chalk = require('chalk')
const router = require('express').Router()
const passport = require('passport')
const lodash = require('lodash')
const { User } = require('../models')
const querystring = require('querystring')
const _ = require('underscore')

const userInfoMiddleware = (req, res, next) => {
  req.body.work = []
  if (Array.isArray(req.body['company[]'])) {
    for (let i = 0; i < req.body['company[]'].length; i++) {
      req.body.work.push({
        company: req.body['company[]'][i],
        position: req.body['position[]'][i],
        website: req.body['companyWebsite[]'][i],
        startDate: req.body['startDate[]'][i],
        endDate: req.body['endDate[]'][i],
        summary: req.body['workSummary[]'][i],
        highlights: req.body['highlights[]'][i]
      })
    }
  } else if (req.body['company[]']) {
    req.body.work.push({
      company: req.body['company[]'],
      position: req.body['position[]'],
      website: req.body['companyWebsite[]'],
      startDate: req.body['startDate[]'],
      endDate: req.body['endDate[]'],
      summary: req.body['workSummary[]'],
      highlights: req.body['highlights[]'] ? [req.body['highlights[]']] : []
    })
  }

  req.body.education = []
  if (Array.isArray(req.body['institution[]'])) {
    for (let i = 0; i < req.body['institution[]'].length; i++) {
      req.body.education.push({
        institution: req.body['institution[]'][i],
        area: req.body['area[]'][i],
        studyType: req.body['studyType[]'][i],
        startDate: req.body['studyStartDate[]'][i],
        endDate: req.body['studyEndDate[]'][i],
        gpa: req.body['gpa[]'][i]
      })
    }
  } else if (req.body['institution[]']) {
    req.body.education.push({
      institution: req.body['institution[]'],
      area: req.body['area[]'],
      studyType: req.body['studyType[]'],
      startDate: req.body['studyStartDate[]'],
      endDate: req.body['studyEndDate[]'],
      gpa: req.body['gpa[]']
    })
  }

  req.body.awards = []
  if (Array.isArray(req.body['title[]'])) {
    for (let i = 0; i < req.body['title[]'].length; i++) {
      req.body.awards.push({
        title: req.body['title[]'][i],
        date: req.body['date[]'][i],
        awarder: req.body['awarder[]'][i],
        summary: req.body['awardSummary[]'][i]
      })
    }
  } else if (req.body['title[]']) {
    req.body.awards.push({
      title: req.body['title[]'],
      date: req.body['date[]'],
      awarder: req.body['awarder[]'],
      summary: req.body['awardSummary[]']
    })
  }

  req.body.skills = []
  if (Array.isArray(req.body['skillName[]'])) {
    for (let i = 0; i < req.body['skillName[]'].length; i++) {
      req.body.skills.push({
        name: req.body['skillName[]'][i],
        level: req.body['level[]'][i],
        keywords: _.map(req.body['keywords[]'][i].split(','), (keyword) => keyword.trim())
      })
    }
  } else if (req.body['skillName[]']) {
    req.body.skills.push({
      name: req.body['skillName[]'],
      level: req.body['level[]'],
      keywords: _.map(req.body['keywords[]'].split(','), (keyword) => keyword.trim())
    })
  }

  req.body.references = []
  if (Array.isArray(req.body['referral[]'])) {
    for (let i = 0; i < req.body['referral[]'].length; i++) {
      req.body.references.push({
        name: req.body['referral[]'][i],
        reference: req.body['reference[]'][i]
      })
    }
  } else if (req.body['referral[]']) {
    req.body.references.push({
      name: req.body['referral[]'],
      reference: req.body['reference[]']
    })
  }

  req.body.profiles = []
  if (req.body.twitter) {
    req.body.profiles.push({
      network: 'Twitter',
      url: req.body.twitter
    })
  }

  if (req.body.github) {
    req.body.profiles.push({
      network: 'Github',
      url: req.body.github
    })
  }

  if (req.body.linkedin) {
    req.body.profiles.push({
      network: 'LinkedIn',
      url: req.body.linkedin
    })
  }

  req.body.location = {
    address: req.body.address,
    city: req.body.city,
    countryCode: req.body.countryCode,
    postalCode: req.body.postalCode,
    region: req.body.region
  }

  next()
}

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/err' }), (req, res) => {
  if (req.session.passport.user.exists) {
    delete req.session.passport.user.exists
    req.session.user = req.session.passport.user
    res.redirect(
      '/?logged-in=' +
      Math.random()
        .toString()
        .slice(2)
        .slice(0, 5)
    )
  } else {
    const query = querystring.stringify({
      username: req.session.passport.user.username
    })

    res.redirect('/account/new/user/info?' + query)
  }
})

router.get('/new/user/info', (req, res, next) => {
  res.render('auth/forms/user', {
    title: req.app.config.name
  })
})

router.post('/new/user/info', userInfoMiddleware, (req, res, next) => {
  console.log(chalk.bgRedBright(JSON.stringify(req.body)))
  lodash.set(req.session.passport.user, ['resume.basics.summary'], req.body.summary)
  lodash.set(req.session.passport.user, ['resume.work'], req.body.work)
  lodash.set(req.session.passport.user, ['resume.education'], req.body.education)
  lodash.set(req.session.passport.user, ['resume.awards'], req.body.awards)
  lodash.set(req.session.passport.user, ['resume.skills'], req.body.skills)
  lodash.set(req.session.passport.user, ['resume.references'], req.body.references)
  lodash.set(req.session.passport.user, ['resume.basics.profiles'], req.body.profiles)
  lodash.set(req.session.passport.user, ['resume.basics.location'], req.body.location)
  const newUser = new User(req.session.passport.user)
  res.status(200).send(newUser)
})

module.exports = router
