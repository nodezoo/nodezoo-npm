
var seneca = require('seneca')()

      .use('redis-transport')
      .use('jsonfile-store')
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

      .listen({type:'redis',pin:'role:info,req:part'})
      .client({type:'redis',pin:'role:info,res:part'})

      .listen()
