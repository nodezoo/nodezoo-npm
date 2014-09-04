
var seneca = require('seneca')()
      .use('jsonfile-store')
      .use('../npm.js')
      .listen()
