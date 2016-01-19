nodezoo-npm - a [nodezoo.com](http://nodezoo.com) Micro-service
===============================================================

The _nodezoo-npm_ micro-service provides an interface to the
[NPM](http://npmjs.org) registry.

One of the micro-services that implement
[nodezoo.com](http://nodezoo.com), a search engine for
[Node.js](http://nodejs.org) modules. The NodeZoo search engine is an
example of a real-world service built using Node.js
micro-services. Each micro-service is published in its own github
repository. The codebase is intended to be used as a larger-scale
example, and as a starting point for your own projects.

The search-engine is under development in an open manner, and a blog
series (see below) covers the full details.

This micro-service uses the Seneca micro-service toolkit. For an
introduction to Seneca itself, see the
[senecajs.org](http://senecajs.org) site.

Feel free to contact me on twitter if you
have any questions! :) [@rjrodger](http://twitter.com/rjrodger)


Tested on: Seneca 0.5.20, Node 0.10.31


## Install

Create a project folder for all the _nodezoo_ micro-service repositories. The _clone_ this repository into your project folder:

```sh
git clone https://github.com/rjrodger/nodezoo-npm.git
```

Alternatively, fork the repository so that you can make your own changes.


## Messages

This micro-service recognizes the following messages:

   * _role:npm,cmd:get_ - get module details by name
   * _role:npm,cmd:query_ - query module details from NPM
   * _role:npm,cmd:extract_ - extract relevant data from NPM result

And issues the following messages:

   * _role:search,cmd:insert_ - insert module details into search engine index, OPTIONAL

It overrides these messages:

   * _role:entity,cmd:save,name:npm_ - insert module details into search engine in parallel to save


## Running

The main business logic is in the
[npm.js](https://github.com/rjrodger/nodezoo-npm/blob/master/npm.js)
file. However, to run the service, you make use of different small
scripts depending on your needs.

When running in a local configuration, this service is exposed over
HTTP on port 9001.

### For Testing

Micro-services should be testable standalone. That means you can run
them and they should "work" (for some value of work), without any
other micro-services running. This is important for automated testing.

In the _nodezoo-npm_ folder:

```sh
$ node srvs/npm-test.js --seneca.log=plugin:npm
```

To test, try:

```sh
$ curl -d '{"role":"npm","cmd":"get","name":"underscore"}' http://localhost:9001/act
```

This will print the details for the
[underscore](http://npmjs.org/package/underscore) module. The module
details are saved as JSON file in the _data_ folder. In production, you
would use a more robust storage mechanism, but JSON files make local
debugging easier.

You'll also observe that the log output of the process prints an
error. That's ok. There's no implementation of the search engine index
available. The micro-service does what it can and proceeds. In a
production enviroment, this error is collected and the monitoring
system might decide to issue an alert.

If you run the _curl_ command a second time, you'll see no error. As
the module data already exists, no action is taken.


### For Development

In this scenario, you run the system on your local machine, usually
with a single instance of each service.

You'll need:
   * a [redis](http://redis.io) server,
   * an [elasticsearch](http://www.elasticsearch.org/) server
   * the [nodezoo-index](http://github.com/rjrodger/nodezoo-index) service

In the _nodezoo-npm_ folder, run the development service:

```sh
$ node srvs/npm-dev.js --seneca.log=plugin:npm
```

Use curl as before:

```sh
$ curl -d '{"role":"npm","cmd":"get","name":"underscore","update":true}' http://localhost:9001/act
```

This time, you have to use the _update_ parameter to force the service
to update the data. The module should now be indexed, which you can confirm by querying elastic search:

```sh
$ curl http://localhost:9200/zoo/mod/underscore
```


### For Production

Production deployment on [AWS](http://aws.amazon.com) and
[Joyent](http://joyent.com) using [Docker](http://docker.com) and
[nscale](http://github.com/nearform/nscale) will be covered later in
the project.


## Development Blog Series

The development of the system is covered in detail in a series of blog
posts on the [skillsmatter.com](http://skillsmatter.com) blog:

   * [Introduction to Node.js Micro-services, Part 1](http://blog.skillsmatter.com/2014/09/10/build-a-search-engine-for-node-js-modules-using-microservices-part-1/)
   * [Running and Testinga Micro-service, Part 2](http://blog.skillsmatter.com/2014/09/17/build-a-search-engine-for-node-js-modules-using-microservices-part-2/)

Hosting and development is sponsored by [nearForm](http://nearform.com).
