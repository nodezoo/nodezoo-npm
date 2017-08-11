/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect


describe('npm', function () {

  it('query', {timeout: 8888}, function (done) {
    var seen = {}

    Seneca()

    // Place Seneca into test mode. Errors will be passed to done callback,
    // so no need to handle them in callbacks.
      .test(done)

    // Uncomment if you want to see detailed logs
    // .test(done, 'print')

      .use('entity')

    // Load the info plugin
      .use('..')

      .add('role:search', function (msg, reply) { reply() })

      .sub('role:entity', function (msg) {
        seen[msg.cmd] = 1 + (seen[msg.cmd]||0)
      })

      .gate()

      .act('role:npm,cmd:query,name:seneca', function (ignore, out) {
        expect(out.id).to.equal('seneca')
        expect(out.giturl).to.contain('senecajs/seneca.git')

        expect(seen).to.equal({ load: 1, save: 1 })
      })

      .act('role:npm,cmd:get,name:seneca', function (ignore, out) {
        expect(out.id).to.equal('seneca')
        expect(out.giturl).to.contain('senecajs/seneca.git')
        
        expect(seen).to.equal({ load: 2, save: 1 })
      })

      .act('role:npm,cmd:get,name:seneca', function (ignore, out) {
        expect(out.id).to.equal('seneca')
        expect(out.giturl).to.contain('senecajs/seneca.git')
        
        expect(seen).to.equal({ load: 3, save: 1 })
      })

      .act('role:npm,cmd:get,name:seneca,update:true', function (ignore, out) {
        expect(out.id).to.equal('seneca')
        expect(out.giturl).to.contain('senecajs/seneca.git')
        
        expect(seen).to.equal({ load: 5, save: 2 })

        done()
      })
  })
})


