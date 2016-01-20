/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
'use strict'
var Request = require('request')


module.exports = function npm (options) {
  let seneca = this

  options = seneca.util.deepextend({
    registry: 'http://registry.npmjs.org/'
  }, options)


  seneca.add('role:npm,cmd:get', cmd_get)
  seneca.add('role:npm,cmd:query', cmd_query)
  seneca.add('role:npm,cmd:extract', cmd_extract)

  seneca.add('role:entity,cmd:save,name:npm', override_index)


  var cmd_get = function (args, done) {
    var seneca = this
    var npm_ent = seneca.make$('npm')

    var npm_name = args.name

    npm_ent.load$(npm_name, (err, npm_value) => {
      if (err) {
        return done(err)
      }

      if (npm_value && !args.update) {
        return done(null, npm_value)
      }
      seneca.act(
          'role:npm,cmd:query',
          { name: npm_name },
          done)
    })
  }


  var cmd_query = function (args, done) {
    var seneca = this
    var npm_ent = seneca.make$('npm')

    var npm_name = args.name

    var url = options.registry + npm_name
    Request.get(url, (err, res, body) => {
      if (err) {
        return done(err)
      }

      var data = JSON.parse(body)

      seneca.act('role:npm,cmd:extract', { data: data }, (err, data_value) => {
        if (err) {
          return done(err)
        }

        npm_ent.load$(npm_name, (err, npm_value) => {
          if (err) {
            return done(err)
          }

          if (npm) {
            return npm_value.data$(data).save$(done)
          }
          data.id$ = npm_name
          npm_ent.make$(data).save$(done)
        })
      })
    })
  }


  var cmd_extract = function (args, done) {
    // var seneca  = this

    var data = args.data
    var dist_tags = data['dist-tags'] || {}
    var latest = ((data.versions || {})[dist_tags.latest]) || {}
    var repository = latest.repository || {}

    var out = {
      name: data._id,
      version: dist_tags.latest,
      giturl: repository.url,
      desc: data.description || '',
      readme: data.readme || ''
    }

    done(null, out)
  }


  var override_index = function (args, done) {
    var seneca = this

    seneca.prior(args, (err, npm_value) => {
      done(err, npm_value)

      seneca.act('role:search,cmd:insert', { data: npm_value.data$() })
    })
  }
}
