
var HOST = process.env.HOST || 'localhost'

require('seneca')()
  .use('redis-transport')
  .use('level-store')

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

  .listen({ host:HOST, type:'redis', pin:'role:info,req:part' })
  .client({ host:HOST, type:'redis', pin:'role:info,res:part' })

  .client({ host:HOST, port:44002, pin:'role:search' })

  .listen(44003)
  .repl(43003)
