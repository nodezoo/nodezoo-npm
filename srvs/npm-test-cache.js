
var seneca = require('seneca')()
      .use('mongo-store',{name:'nodezoo',host:'localhost'})
      .use('memcached-cache')
      .use('vcache')
      .use('../npm.js')
      .client({port:9003,pin:'role:search'})
      .listen()
