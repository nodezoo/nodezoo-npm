
var HOST = process.env.HOST || 'localhost'
var REDIS = process.env.REDIS || 'localhost'
var BEANSTALK = process.env.BEANSTALK || 'localhost'
var STATS = process.env.STATS || 'localhost'

require('seneca')()
  .use('redis-transport')
  .use('beanstalk-transport')
  .use('level-store')
  .use('msgstats',{
    udp: { host: STATS },
    pin:'role:npm,cmd:get'
  })

  .use('../npm.js')

  .add('role:info,req:part',function(args,done){
    done()

    this.act(
      'role:npm,cmd:get',
      {name:args.name},
      function(err,mod){
        if( err ) return done(err);
        
        this.act('role:info,res:part,part:npm',
                 {name:args.name,data:mod.data$()})
      })
  })

  .add('role:npm,info:change',function(args,done){
    done()
    this.act('role:npm,cmd:get',{name:args.name,update:true})
  })

  .listen({ host:REDIS, type:'redis', pin:'role:info,req:part' })
  .client({ host:REDIS, type:'redis', pin:'role:info,res:part' })

  .client({ host:HOST, port:44002, pin:'role:search' })

  .listen({ host:BEANSTALK, type:'beanstalk', pin:'role:npm,info:change' })

  .listen(44003)
  .repl(43003)
