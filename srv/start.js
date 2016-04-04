'use strict'

var Seneca = require('seneca')
var Mesh = require('seneca-mesh')
var Npm = require('../lib/npm')
var Entity = require('seneca-entity')

var envs = process.env
var opts = {
  seneca: {
    tag: envs.NPM_TAG || 'nodezoo-search'
  },
  npm: {
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:npm,cmd:get', model: 'consume'},
      {pin: 'role:info,req:part', model: 'observe'}
    ]
  }
}

Seneca(opts.seneca)
  .use(Entity)
  .use(Npm, opts.npm)
  .use(Mesh, opts.mesh)
