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
  var distTags = data['dist-tags'] || {}
  var latest = ((data.versions || {})[distTags.latest]) || {}

  var out = {
    name: data.name || '',
    url: url || '',
    id: data._id || '',
    description: data.description || '',
    latestVersion: distTags.latest || '',
    releaseCount: Object.keys(data.versions).length || '',
    dependencies: latest.dependencies || '',
    author: data.author || '', // Contains variables name and email
    licence: latest.license || '',
    maintainers: data.maintainers || '', // Contains variables name and email
    readme: data.readme || '',
    homepage: data.homepage || ''
  }

  done(null, out)
}
