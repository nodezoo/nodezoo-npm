/* Copyright (c) 2014 Richard Rodger */
"use strict";


// mocha npm.test.js


var seneca  = require('seneca')

var assert  = require('assert')


function make_errhandler(fin) {
  return function(err){ err && fin(err); return true; }
}


describe('npm', function() {

  var si = seneca({log:'silent',from:'./mine.options.js'})
        .use('jsonfile-store')
        .use('../npm.js')

  it('extract', function( fin ) {
    si.options({errhandler:make_errhandler(fin)})

    si.act(
      'role:npm,cmd:extract',
      {data:test_data}, function(err,out){
        //console.log(out)
        assert.equal('npm-version-verify-test',out.name)
        assert.equal('0.0.2',out.version)
        fin()
      })
  })


  it('query', function( fin ) {
    si.options({errhandler:make_errhandler(fin)})

    si.act(
      'role:npm,cmd:query',
      {name:'npm-version-verify-test'}, 
      function(err,out){
        assert.equal('npm-version-verify-test',out.name)
        assert.equal('0.0.2',out.version)
        fin()
      })
  })

  it('get', function( fin ) {
    si.options({errhandler:make_errhandler(fin)})

    si.make$('npm').load$('npm-version-verify-test',function(err,out){

      if( out ) {
        out.remove$(do_get)
      }
      else do_get()

      function do_get() {
        si.act(
          'role:npm,cmd:get',
          {name:'npm-version-verify-test'}, 
          function(err,out){
            assert.equal('npm-version-verify-test',out.name)
            assert.equal('0.0.2',out.version)
            fin()
          })
      }
    })

  })

})


var test_data = {"_id":"npm-version-verify-test","_rev":"4-1f91d74e54b422087c872c6994d16774","name":"npm-version-verify-test","description":"npm-version-verify-test =======================","dist-tags":{"latest":"0.0.2"},"versions":{"0.0.1":{"name":"npm-version-verify-test","version":"0.0.1","description":"npm-version-verify-test =======================","main":"index.js","scripts":{"test":"echo \"Error: no test specified\" && exit 1"},"repository":{"type":"git","url":"git://github.com/rjrodger/npm-version-verify-test.git"},"author":{"name":"Richard Rodger"},"license":"MIT","bugs":{"url":"https://github.com/rjrodger/npm-version-verify-test/issues"},"homepage":"https://github.com/rjrodger/npm-version-verify-test","_id":"npm-version-verify-test@0.0.1","dist":{"shasum":"879e63f5ce1a87f257950ab3111d7ddd055efa6f","tarball":"http://registry.npmjs.org/npm-version-verify-test/-/npm-version-verify-test-0.0.1.tgz"},"_from":".","_npmVersion":"1.3.21","_npmUser":{"name":"rjrodger","email":"richard.rodger@nearform.com"},"maintainers":[{"name":"rjrodger","email":"richard.rodger@nearform.com"}],"directories":{}},"0.0.2":{"name":"npm-version-verify-test","version":"0.0.2","description":"npm-version-verify-test =======================","main":"index.js","scripts":{"test":"echo \"Error: no test specified\" && exit 1"},"repository":{"type":"git","url":"git://github.com/rjrodger/npm-version-verify-test.git"},"author":{"name":"Richard Rodger"},"license":"MIT","bugs":{"url":"https://github.com/rjrodger/npm-version-verify-test/issues"},"homepage":"https://github.com/rjrodger/npm-version-verify-test","_id":"npm-version-verify-test@0.0.2","dist":{"shasum":"53311a60f8a527ece5a732d0a0cd6c22a33c3e84","tarball":"http://registry.npmjs.org/npm-version-verify-test/-/npm-version-verify-test-0.0.2.tgz"},"_from":".","_npmVersion":"1.3.21","_npmUser":{"name":"rjrodger","email":"richard.rodger@nearform.com"},"maintainers":[{"name":"rjrodger","email":"richard.rodger@nearform.com"}],"directories":{}}},"readme":"npm-version-verify-test\u000a=======================\u000a\u000anpm-version-verify-test\u000a","maintainers":[{"name":"rjrodger","email":"richard.rodger@nearform.com"}],"time":{"modified":"2014-02-17T22:08:41.051Z","created":"2014-02-17T21:43:15.953Z","0.0.1":"2014-02-17T21:43:15.953Z","0.0.2":"2014-02-17T22:08:41.051Z"},"readmeFilename":"README.md","_attachments":{}};
