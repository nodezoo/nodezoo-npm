![logo-nodezoo](https://raw.githubusercontent.com/rjrodger/nodezoo-web/to-redux/client/assets/img/logo-nodezoo.png)

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

## Running

The main business logic is in the
[npm.js](https://github.com/rjrodger/nodezoo-npm/blob/master/npm.js)
file. However, to run the service, you make use of different small
scripts depending on your needs.

When running in a local configuration, this service is exposed over
HTTP on port 9001.

Hosting and development is sponsored by [nearForm](http://nearform.com).

## Contributing
The [NodeZoo](http://www.nodezoo.com/) org encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

## License
Copyright (c) 2015, Richard Rodgers and other contributors.
Licensed under [MIT](./LICENSE).
