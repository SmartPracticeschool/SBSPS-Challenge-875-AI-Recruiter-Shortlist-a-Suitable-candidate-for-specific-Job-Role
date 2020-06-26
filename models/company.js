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
    unique: [true, 'Company with this name already exists']
  },
  username: {
    type: String,
    required: true,
    unique: [true, 'Company with this name already exists']
  },
  logo: String,
  website: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v)
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v)
    }
  },
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
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  location: {
    address: String,
    countryCode: String,
    postalCode: Number,
    area: String,
    city: String
  }
})

module.exports = mongoose.model('Company', companySchema)
