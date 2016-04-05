'use strict'


var Request = require('request')
var url
var opts = {
  registry: 'http://registry.npmjs.org/'
}


module.exports = function npm (options) {
  var seneca = this

  opts = seneca.util.deepextend(opts, options)

  seneca.add('role:npm,cmd:get', cmd_get)
  seneca.add('role:npm,cmd:query', cmd_query)
  seneca.add('role:npm,cmd:extract', cmd_extract)

  return {
    name: 'nodezoo-npm'
  }
}

function cmd_get (args, done) {
  var seneca = this
  var npm_ent = seneca.make$('npm')

  var npm_name = args.name

  npm_ent.load$(npm_name, function (err, npm) {
    if (err) return done(err)

    if (npm && !args.update) {
      return done(null, npm)
    }
      else {
      seneca.act(
        'role:npm,cmd:query',
        {name: npm_name},
        done)
    }
  })
}

function cmd_query (args, done) {
  var seneca = this

  var npm_ent = seneca.make$('npm')
  var npm_name = args.name

  url = opts.registry + npm_name
  Request.get({url: url, gzip: true}, function (err, res, body) {
    if (err) return done(err)

    var data = JSON.parse(body)

    seneca.act('role:npm,cmd:extract', {data: data}, function (err, data) {
      if (err) return done(err)

      npm_ent.load$(npm_name, function (err, npm) {
        if (err) return done(err)

        if (npm) {
          return npm.data$(data).save$(done)
        }
        else {
          data.id$ = npm_name
          npm_ent.make$(data).save$(done)
        }
      })
    })
  })
}

function cmd_extract (args, done) {
  var data = args.data
  var dist_tags = data['dist-tags'] || {}
  var latest = ((data.versions || {})[dist_tags.latest]) || {}
  var repository = latest.repository || {}

  var out = {
    name: data._id,
    url: url,
    version: dist_tags.latest,
    giturl: repository.url,
    desc: data.description || '',
    readme: data.readme || ''
  }

  done(null, out)
}
