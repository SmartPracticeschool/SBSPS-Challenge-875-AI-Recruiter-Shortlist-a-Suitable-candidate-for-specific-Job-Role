const { db: { connectionUri } } = require('../config/app')
const mongoose = require('mongoose')

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const roomSchema = mongoose.Schema({
  users: Array,
  chats: {
    type: Array,
    default: [] // {txt:"Hi", by:"john", time:"10:35pm"}
  }
})

module.exports = mongoose.model('Room', roomSchema)
