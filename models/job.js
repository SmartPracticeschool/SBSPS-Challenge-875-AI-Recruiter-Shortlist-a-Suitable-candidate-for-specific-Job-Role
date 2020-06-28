const { db: { connectionUri } } = require('../config/app')
const mongoose = require('mongoose')

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const applicationSchema = mongoose.Schema({
  for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  botRound: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  personality: {
    wholeText: String,
    openness: Number,
    conscientiousness: Number,
    extraversion: Number,
    agreeableness: Number,
    euroticism: Number
  },
  tone: {
    text: String,
    joy: Number,
    anger: Number,
    analytical: Number,
    fear: Number,
    confident: Number,
    sadness: Number,
    tentative: Number
  }
})

const jobSchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: '0-1 years'
  },
  skills: {
    type: Array,
    default: []
  },
  description: String,
  pay: Number,
  hiring: {
    type: Boolean,
    default: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
})

module.exports = {
  Application: mongoose.model('Application', applicationSchema),
  Job: mongoose.model('Job', jobSchema)
}
