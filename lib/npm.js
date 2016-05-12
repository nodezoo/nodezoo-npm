'use strict'


var Request = require('request')

var opts = {
  registry: 'http://registry.npmjs.org/'
}

module.exports = function (options) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(opts, options)
  opts.cache = seneca.make$('npm_cache')

  seneca.add('role:npm,cmd:get', cmdGet)
  seneca.add('role:info,req:part', aliasGet)

  return {
    name: 'nodezoo-npm'
  }
}

function cmdGet (msg, done) {
  let cache = opts.cache
  let context = this

  cache.load$(msg.name, (err, npm) => {
    if (err) {
      context.log.debug(`Cannot load from cache module ${msg.name}, try now to get it remotely`)
    }

    function complete (err, entity) {
      if (err) {
        return done(null, {ok: false, err: err})
      }
      else {
        done(null, {ok: true, data: entity.data$(entity)})
      }
    }

    if (npm && !msg.update) {
      return complete(null, npm)
    }

    var registry = opts.registry + msg.name

    Request.get({url: registry, gzip: true}, (err, res, body) => {
      if (err) {
        return complete(err)
      }

      var data = null

      try {
        data = JSON.parse(body)
      }
      catch (e) {
        return complete(e)
      }

      var distTags = data['dist-tags'] || {}
      var latest = ((data.versions || {})[distTags.latest]) || {}
      var repository = latest.repository || {}
      var urlRepo = repository.url || ''
      var author = latest.author || {}
      var maintainers = data.maintainers || []

      if (Object.keys(data).length > 0) {
        var out = {
          id: data.name || '',
          name: data.name || '',
          urlRepo: urlRepo || '',
          urlPkg: 'https://www.npmjs.com/package/' + data.name || '',
          description: data.description || '',
          latestVersion: distTags.latest || '',
          releaseCount: Object.keys(data.versions || {}).length || 0,
          dependencies: latest.dependencies || {},
          author: {name: author.name || '', email: author.email || ''},
          licence: latest.license || '',
          maintainers: maintainers || [],
          readme: data.readme || '',
          homepage: data.homepage || '',
          cached: Date.now()
        }

        if (npm) {
          npm.data$(out).save$(complete)
        }
        else {
          data.id$ = msg.name
          cache.make$(out).save$(complete)
        }
      }
      else {
        return done(null, {ok: false, err: new Error('not found on npm')})
      }
    })
  })
}

function aliasGet (msg, done) {
  var seneca = this
  var payload = {name: msg.name}

  seneca.act('role:npm,cmd:get', payload, (err, res) => {
    if (err) {
      return done(null, {ok: false, err: err})
    }

    if (res && res.ok) {
      payload.data = res.data
      seneca.act('role:info,res:part,part:npm', payload)
    }

    done(null, {ok: true})
  })
}
