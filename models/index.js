const { Comment, Like, Post } = require('./post')

module.exports = {
  Comment,
  Company: require('./company'),
  Job: require('./job'),
  Like,
  Post,
  Room: require('./room'),
  User: require('./user')
}
