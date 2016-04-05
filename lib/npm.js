'use strict'

var Request = require('request')

var opts = {
  registry: 'http://registry.npmjs.org/'
}

module.exports = function (options) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(opts, options)

  seneca.add('role:npm,cmd:get', get)
  seneca.add('role:npm,cmd:query', query)
  seneca.add('role:npm,cmd:extract', extract)
  seneca.add('role:info,req:part', aliasGet)

  seneca.add()

  return {
    name: 'nodezoo-npm'
  }
}

function aliasGet (msg, done) {
  this.act('role:npm,cmd:get', msg, function (err, reply) {
    if (err) return done (err)

    this.act('role:info,res:part,part:npm', reply.data$())
    done()
  })
}

function get (msg, done) {
  var seneca = this
  var cache = seneca.make$('npm')
  var name = msg.name

  cache.load$(name, function (err, npm) {
    if (err) return done(err)

    if (npm && !msg.update) {
      return done(null, npm)
    }

    seneca.act('role:npm,cmd:query', {name: name}, done)
  })
}

function query (msg, done) {
  var seneca = this
  var cache = seneca.make$('npm')
  var name = msg.name

  var url = opts.registry + name

  Request.get({url: url, gzip:true}, function (err, res, body) {
    if (err) return done(err)

    var data = JSON.parse(body)
    data.url = 'http://npmjs.com/' + name

    seneca.act('role:npm,cmd:extract', {data: data}, function (err, data) {
      if (err) return done(err)

      cache.load$(name, function (err, npm) {
        if (err) return done(err)
        if (npm) return npm.data$(data).save$(done)

        data.id$ = name
        cache.make$(data).save$(done)
      })
    })
  })
}

function extract (msg, done) {
  var data = msg.data
  var dist_tags = data['dist-tags'] || {}
  var latest = ((data.versions || {})[dist_tags.latest]) || {}
  var repository = latest.repository || {}

  done(null, {
    name: data._id,
    url: data.url,
    version: dist_tags.latest,
    giturl: repository.url,
    desc: data.description || ''
  })
}
