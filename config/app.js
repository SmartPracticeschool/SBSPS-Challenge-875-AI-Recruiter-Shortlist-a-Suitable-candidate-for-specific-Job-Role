const dbHost = process.env.DBHOST || 'localhost'

module.exports = {
  name: 'apply-by-ai',
  title: 'Apply-by-AI',
  http: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000
  },
  author: 'und3fined-v01d',
  version: '1.0.0',
  db: {
    connectionUri: `mongodb://${dbHost}:27017/apply-by-ai`,
    params: {},
    collections: ['moment', 'user', 'feeling', 'ask']
  }
}
