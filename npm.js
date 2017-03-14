/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var Wreck = require('wreck')



module.exports = function npm( options ){
  var seneca = this

  options = seneca.util.deepextend({
    registry: 'http://registry.npmjs.org/'
  },options)


  seneca.add( 'role:npm,cmd:get', cmd_get )
  seneca.add( 'role:npm,cmd:query', cmd_query )
  seneca.add( 'role:npm,cmd:extract', cmd_extract )

  seneca.add('role:entity,cmd:save,name:npm', override_index)


  function cmd_get (msg, reply) {
    var seneca  = this

    if (msg.update) {
      return seneca.act('role:npm,cmd:query', {name: msg.name}, reply)
    }

    seneca
      .make$('npm')
      .load$(msg.name, reply)
  }


  function cmd_query( msg, reply ) {
    var seneca  = this
    var npm_ent = seneca.make$('npm')

    var npm_name = msg.name

    var url = 

    Wreck.get( options.registry + npm_name, function (err, res, payload) {
      if(err) return reply(err)

      var data = JSON.parse(payload.toString())

      seneca.act(
        'role:npm,cmd:extract',
        {data:data},
        function (err, data) {
          if(err) return reply(err)

          npm_ent
            .load$(npm_name, function (err, npm) {
              if (err) return reply(err)
          
              if (npm) {
                return npm
                  .data$(data)
                  .save$(reply)
              }

              data.id$ = npm_name
              npm_ent
                .make$(data)
                .save$(reply)
            })
        })
    })
  }


  function cmd_extract( msg, reply ) {
    var seneca  = this

    var data       = msg.data
    var dist_tags  = data['dist-tags'] || {}
    var latest     = ((data.versions||{})[dist_tags.latest]) || {}
    var repository = latest.repository || {}

    var out = {
      name:    data._id,
      version: dist_tags.latest,
      giturl:  repository.url,
      desc:    data.description || '',
      readme:  data.readme || ''
    }

    reply(null,out)
  }


  function override_index( msg, reply ) {
    var seneca = this

    seneca.prior(msg, function(err,npm){
      reply(err,npm)

      seneca.act('role:search,cmd:insert',{data:npm.data$()})
    })
  }

}
