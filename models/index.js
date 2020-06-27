const { Comment, Like, Post } = require('./post')
const { Message, Room } = require('./room')
const { Notification, User } = require('./user')

module.exports = {
  Comment,
  Company: require('./company'),
  Job: require('./job'),
  Like,
  Message,
  Notification,
  Post,
  Room,
  User
}
