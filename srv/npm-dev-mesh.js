/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var Seneca = require('seneca')

Seneca({tag: 'npm'})
  //.test()
  .test('print')
  .use('monitor')

  .use('entity')
  .use('jsonfile-store', {folder: __dirname+'/../data'})

  .use('../npm.js')

  .use('mesh', {
    listen: [
      {pin: 'role:npm'},
      {pin: 'role:info,need:part', model:'observe'}
    ]
  })

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

