/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var PORT = process.env.PORT || 9000

var Seneca = require('seneca')

Seneca({tag: 'npm'})
  .listen(PORT)

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

  .client({pin:'role:search', host:'search', port:PORT})
  .client({pin:'role:info', host:'info', port:PORT})
