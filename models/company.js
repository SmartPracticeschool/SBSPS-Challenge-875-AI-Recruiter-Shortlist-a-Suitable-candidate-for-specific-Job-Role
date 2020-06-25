const { db: { connectionUri } } = require('../config/app')
const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  website: {
    type: String,
    validate: {
      validator: (v) => validator.isUrl(v)
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v)
    }
  },
  avatar: String,
  size: Number,
  description: String,
  jobListings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }
  ],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  notifications: {
    type: Array,
    default: []
  },
  usertype: {
    type: String,
    default: 'company'
  },
  post: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

module.exports = mongoose.model('Company', companySchema)
