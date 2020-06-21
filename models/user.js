const { db: { connectionUri } } = require('../config/app')
const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const User = mongoose.Schema({
  username: String,
  accessToken: String,
  refreshToken: String,
  resume: {
    basics: {
      name: {
        type: String,
        required: true
      },
      label: String,
      picture: String,
      email: {
        type: String,
        required: true,
        validate: {
          validator: (v) => validator.isEmail(v)
        }
      },
      phone: {
        type: String,
        validate: {
          validator: (v) => validator.isMobilePhone(v)
        }
      },
      website: {
        type: String,
        validate: {
          validator: (v) => validator.isUrl(v)
        }
      },
      summary: {
        type: String,
        default: 'Connect with me on Apply-by-AI'
      },
      location: {
        address: String,
        postalCode: String,
        city: String,
        countryCode: String,
        region: String
      },
      profiles: {
        type: Array,
        default: []
        /*
          "network": "Twitter",
          "username": "john",
          "url": "http://twitter.com/john"
        */
      }
    },
    work: {
      type: Array,
      default: []
      /*
        "company": "Company",
        "position": "President",
        "website": "http://company.com",
        "startDate": "2013-01-01",
        "endDate": "2014-01-01",
        "summary": "Description...",
        "highlights": ["Started the company"]
       */
    },
    volunteer: {
      type: Array,
      default: []
      /*
        "organization": "Organization",
        "position": "Volunteer",
        "website": "http://organization.com/",
        "startDate": "2012-01-01",
        "endDate": "2013-01-01",
        "summary": "Description...",
        "highlights": [
          "Awarded 'Volunteer of the Month'"
        ]
      */
    },
    education: {
      type: Array,
      default: []
      /*
          "institution": "University",
          "area": "Software Development",
          "studyType": "Bachelor",
          "startDate": "2011-01-01",
          "endDate": "2013-01-01",
          "gpa": "4.0",
          "courses": [
            "DB1101 - Basic SQL"
          ]
      */
    },
    awards: {
      type: Array,
      default: []
      /*
        "title": "Award",
        "date": "2014-11-01",
        "awarder": "Company",
        "summary": "There is no spoon."
      */
    },
    publications: {
      type: Array,
      default: []
      /*
        "name": "Publication",
        "publisher": "Company",
        "releaseDate": "2014-10-01",
        "website": "http://publication.com",
        "summary": "Description..."
      */
    },
    skills: {
      type: Array,
      default: []
      /*
        "name": "Web Development",
        "level": "Master",
        "keywords": [
          "HTML",
          "CSS",
          "Javascript"
        ]
      */
    }
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  followers: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  notifications: {
    type: Array,
    default: []
  },
  hirable: {
    type: Boolean,
    default: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  usertype: {
    type: String,
    default: 'user'
  },
  onModel: {
    type: String,
    enum: ['Company', 'User']
  }
})

// create the model for users and expose it to our app
module.exports = mongoose.model('user', User)
