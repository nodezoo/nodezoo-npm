/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var MOCK_SEARCH = JSON.parse(process.env.MOCK_SEARCH || 'false')
var MOCK_INFO = JSON.parse(process.env.MOCK_INFO || 'false')
var MOCK = MOCK_SEARCH || MOCK_INFO


var Seneca = require('seneca')


Seneca({tag: 'npm'})
  .test('print')

  .use('entity')
  .use('jsonfile-store', {folder: __dirname+'/../data'})

  .use('../npm.js')

  .add('role:info,need:part',function(msg,reply){
    reply()

    this.act(
      'role:npm,cmd:get',
      {name:msg.name},
      function(err,mod){
        if( err ) return reply(err)

        this.act('role:info,collect:part,part:npm',
                 {name:msg.name, data:this.util.clean(mod.data$())})
      })
  })

  .use('seneca-repl', {port:10040})

  .listen(9040)

  // Use port numbers for local development.
  .client({pin:'role:search', port:9020})
  .client({pin:'role:info', port:9030})


/*
  .add('role:npm,info:change',function(msg,reply){
    reply()
    this.act('role:npm,cmd:get',{name:msg.name,update:true})
  })
*/


// Run mock services that this service depends on.
if (MOCK) {
  var mock = Seneca({tag:'mock'})
        .test('print')
        .use('entity')

  if (MOCK_SEARCH) {
    mock
    .listen(9020)
    .add('role:search', function (msg, reply) {
      reply()
    })
  }

  if (MOCK_INFO) {
    mock
    .listen(9030)
    .add('role:info', function (msg, reply) {
      reply()
    })
  }
}
