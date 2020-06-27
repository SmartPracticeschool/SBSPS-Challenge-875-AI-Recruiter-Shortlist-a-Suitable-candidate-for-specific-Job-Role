const { db: { connectionUri } } = require('../config/app')
const mongoose = require('mongoose')

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const applicationSchema = mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  selected: {
    type: Boolean,
    default: false
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
