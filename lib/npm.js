'use strict'


var Request = require('request')
var url
var opts = {
  registry: 'http://registry.npmjs.org/'
}


module.exports = function npm (options) {
  var seneca = this

  opts = seneca.util.deepextend(opts, options)

  seneca.add('role:npm,cmd:get', cmdGet)
  seneca.add('role:npm,cmd:query', cmdQuery)
  seneca.add('role:npm,cmd:extract', cmdExtract)

  return {
    name: 'nodezoo-npm'
  }
}

function cmdGet (args, done) {
  var seneca = this
  var npmEnt = seneca.make$('npm')

  var npmName = args.name

  npmEnt.load$(npmName, function (err, npm) {
    if (err) return done(err)

    if (npm && !args.update) {
      return done(null, npm)
    }
      else {
      seneca.act(
        'role:npm,cmd:query',
        {name: npmName},
        done)
    }
  })
}

function cmdQuery (args, done) {
  var seneca = this

  var npmEnt = seneca.make$('npm')
  var npmName = args.name

  url = opts.registry + npmName
  Request.get({url: url, gzip: true}, function (err, res, body) {
    if (err) return done(err)
    url = 'https://npmjs.org/package' + npmName

    var data = JSON.parse(body)

    seneca.act('role:npm,cmd:extract', {data: data}, function (err, data) {
      if (err) return done(err)

      npmEnt.load$(npmName, function (err, npm) {
        if (err) return done(err)

        if (npm) {
          return npm.data$(data).save$(done)
        }
        else {
          data.id$ = npmName
          npmEnt.make$(data).save$(done)
        }
      })
    })
  })
}

function cmdExtract (args, done) {
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
