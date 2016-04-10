'use strict'

var Seneca = require('seneca')
var Entities = require('seneca-entity')
var Mesh = require('seneca-mesh')
var Npm = require('../lib/npm')
var RedisStore = require('seneca-redis-store')

var envs = process.env
var opts = {
  seneca: {
    tag: envs.NPM_TAG || 'nodezoo-npm'
  },
  npm: {
    registry: envs.NPM_REGISTRY || 'http://registry.npmjs.org/'
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:npm,cmd:get', model: 'consume'},
      {pin: 'role:info,req:part', model: 'observe'}
    ]
  },
  isolated: {
    host: envs.NPM_HOST || 'localhost',
    port: envs.NPM_PORT || '8051'
  },
  redis: {
    host: 'localhost',
    port: envs.NPM_REDIS_PORT || '6379'
  }
}

var Service = Seneca(opts.seneca)

Service.use(Entities)

if (envs.NPM_ISOLATED) {
  Service.listen(opts.isolated)
}
else {
  Service.use(Mesh, opts.mesh)
  Service.use(RedisStore, opts.redis)
}

Service.use(Npm, opts.npm)
