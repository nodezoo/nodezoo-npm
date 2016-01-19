'use strict';
/*var HOST = process.env.HOST || 'localhost'*/ // never used
const STATS = process.env.STATS || 'localhost';

require('seneca')()
  .use('level-store')
  .use('msgstats',{
      udp: { host: STATS },
      pin:'role:npm,cmd:get'
  })

  .use('../npm.js')

  .add('role:info,req:part',function (args,done){

      done();

      this.act(
      'role:npm,cmd:get',
      { name:args.name },
      function (err,mod){

          if ( err ) {
              return done(err);
          }

          this.act('role:info,res:part,part:npm',
                 { name:args.name,data:mod.data$() });
      });
  })

  .add('role:npm,info:change',function (args,done){

      done();
      this.act('role:npm,cmd:get',{ name:args.name,update:true });
  })

  .use( 'mesh',
        { auto:true, pins:['role:npm','role:info,req:part'], model:'publish' } );
