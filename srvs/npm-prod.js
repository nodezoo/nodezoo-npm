'use strict';

require('seneca')()
  .use('redis-transport')
  .use('beanstalk-transport')
  .use('jsonfile-store')
  .use('../npm.js')
  .add('role:info,req:part',function(args,done){
    done();
    this.act('role:npm,cmd:get', {name:args.name}, function(err,mod){
      if( err ) { return done(err); }
      this.act('role:info,res:part,part:npm', {name:args.name,data:mod.data$()});
    });
  })
  .listen({host: process.env.REDIS_IP, type:'redis',pin:'role:info,req:part'})
  .client({host: process.env.REDIS_IP, type:'redis',pin:'role:info,res:part'})
  .listen({host: process.env.BEANSTALK_IP, port: 1130, type: 'beanstalk', pin: 'role:npm,cmd:*'})
  .client({host: process.env.BEANSTALK_IP, port: 1130, type: 'beanstalk', pin: 'role:search,cmd:*'});

