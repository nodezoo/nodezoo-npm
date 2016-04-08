var opts = {
  redis: {
    host: 'localhost',
    port: process.env.redis_PORT
  }
}

require('seneca')()
  .use('entity')
  .use('../lib/npm.js')
  .use('redis-store', opts.redis)
  .add('role:info,req:part', function (args, done) {
    done()

    this.act('role:npm,cmd:get', {name: args.name}, function (err, mod) {
      if (err) {
        return done(err)
      }

      this.act('role:info,res:part,part:npm', {name: args.name, data: mod.data$()})
    })
  })

  .add('role:npm,info:change', function (args, done) {
    done()
    this.act('role:npm,cmd:get', {name: args.name, update: true})
  })
  .use('mesh', {auto: true, pins: ['role:npm', 'role:info,req:part'], model: 'publish'})
