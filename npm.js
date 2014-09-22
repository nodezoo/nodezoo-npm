/* Copyright (c) 2014 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
"use strict";


var request = require('request')



module.exports = function npm( options ){
  var seneca = this

  options = seneca.util.deepextend({
    registry: 'http://registry.npmjs.org/'
  },options)


  seneca.add(
    'role:npm,cmd:get', 
    {
      name: { required$:true, string$:true },
    }, 
    cmd_get)


  seneca.add(
    'role:npm,cmd:query', 
    { 
      name: { required$:true, string$:true },
    },
    cmd_query)


  seneca.add(
    'role:npm,cmd:extract', 
    {
      data: { required$:true, object$:true },
    },
    cmd_extract)


  seneca.add('role:entity,cmd:save,name:npm',override_index)


  function cmd_get( args, done ) {
    var seneca  = this
    var npm_ent = seneca.make$('npm')

    var npm_name = args.name

    npm_ent.load$( npm_name, function(err,npm){
      if( err ) return done(err);

      if( npm && !args.update ) {
        return done(null,npm);
      }
      else {
        seneca.act(
          'role:npm,cmd:query',
          {name:npm_name},
          done)
      }
    })
  }


  function cmd_query( args, done ) {
    var seneca  = this
    var npm_ent = seneca.make$('npm')

    var npm_name = args.name

    var url = options.registry+npm_name
    request.get( url, function(err,res,body){
      if(err) return done(err);

      var data = JSON.parse(body)

      seneca.act('role:npm,cmd:extract',{data:data},function(err,data){
        if(err) return done(err)

        npm_ent.load$(npm_name, function(err,npm){
          if( err ) return done(err);
          
          if( npm ) {
            return npm.data$(data).save$(done);
          }
          else {
            data.id$ = npm_name
            npm_ent.make$(data).save$(done);
          } 
        })
        
      })
    })
  }


  function cmd_extract( args, done ) {
    var seneca  = this

    var data       = args.data
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

    done(null,out)
  }



  function override_index( args, done ) {
    var seneca = this

    seneca.prior(args, function(err,npm){
      done(err,npm)

      seneca.act('role:search,cmd:insert',{data:npm.data$()})
    })
  }

}
