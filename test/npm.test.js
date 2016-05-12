'use strict'

var Lab = require('lab')
var Code = require('code')
var Proxyquire = require('proxyquire')
var NpmFakeData = require('./npm-data')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect

process.setMaxListeners(999)

var NpmProxy = {
  request: {
    get: (opts, done) => {
      if (opts.url.includes('seneca-entity')) {
        done(null, {}, JSON.stringify(NpmFakeData))
      }
      else {
        done(new Error('npm error'), null, null)
      }
    }
  }
}

var Seneca = Proxyquire('seneca', {})
var Npm = Proxyquire('..', NpmProxy)

function createInstance (done) {
  var params = {
    log: 'silent',
    strict: 'false',
    errhandler: (err) => {
      if (err.at) done(err)
    }
  }

  return Seneca(params)
    .use('entity')
    .use(Npm)
}

describe('A valid role:npm,cmd:get call', () => {
  it('Has no error and data', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()
      expect(reply).to.exist()
      done()
    })
  })

  it('Has id field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.id).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has name field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.name).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has urlPkg field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.urlPkg).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has urlRepo field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.urlRepo).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has description field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.description).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has latestVersion field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.latestVersion).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has releaseCount field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.releaseCount).to.exist().and.to.be.a.number()
      done()
    })
  })

  it('Has dependencies field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.dependencies).to.exist().and.to.be.an.object()
      done()
    })
  })

  it('Has author field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.author).to.exist().and.to.be.a.object()
      done()
    })
  })
  it('Has licence field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.licence).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has maintainers field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.maintainers).to.exist().and.to.be.an.array()
      done()
    })
  })

  it('Has readme field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.readme).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has homepage field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.homepage).to.exist().and.to.be.a.string()
      done()
    })
  })

  it('Has cached field', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.cached).to.exist().and.to.be.a.number()
      done()
    })
  })

  it('Returns cached data', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()
      var cachedOne = reply.cached
      seneca.act('role:npm,cmd:get', payload, (err, reply) => {
        expect(err).to.not.exist()
        var cachedTwo = reply.cached
        expect(cachedOne).to.equal(cachedTwo)
        done()
      })
    })
  })

  it('Can return non-cached data', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      var cachedOne = reply.data.cached
      payload.update = true

      seneca.act('role:npm,cmd:get', payload, (err, reply) => {
        expect(err).to.not.exist()

        expect(reply).to.exist()
        expect(reply.data).to.exist()
        expect(reply.err).to.not.exist()
        expect(reply.ok).to.be.true()

        var cachedTwo = reply.data.cached
        expect(cachedOne).to.be.below(cachedTwo)
        done()
      })
    })
  })
})

describe('An invalid role:npm,cmd:get call', () => {
  it('Has an error and no data', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'randomName0927e3'}

    seneca.act('role:npm,cmd:get', payload, (err, reply) => {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.not.exist()
      expect(reply.err).to.exist()
      expect(reply.ok).to.be.false()

      done()
    })
  })
})

describe('A valid role:info,req:part call', () => {
  it('Has no error and has data', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.act('role:info,req:part', payload, (err, reply) => {
      expect(err).to.not.exist()
      expect(reply).to.exist()
      done()
    })
  })

  it('Responds via role:info,res:part', (done) => {
    var seneca = createInstance(done)
    var payload = {name: 'seneca-entity'}

    seneca.add('role:info,res:part', (msg, cb) => {
      expect(msg).to.exist()
      cb()
      done()
    })

    seneca.act('role:info,req:part', payload, function (err, reply) {
      expect(err).to.not.exist()
      expect(reply).to.exist()
    })
  })
})
