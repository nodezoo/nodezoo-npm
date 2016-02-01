![logo-nodezoo](https://raw.githubusercontent.com/rjrodger/nodezoo-web/to-redux/client/assets/img/logo-nodezoo.png)

nodezoo-npm - a [nodezoo.com](http://nodezoo.com) Micro-service
===============================================================

The _nodezoo-npm_ micro-service provides an interface to the
[NPM](http://npmjs.org) registry.

## Install

Create a project folder for all the _nodezoo_ micro-service repositories. The _clone_ this repository into your project folder:

```sh
git clone https://github.com/rjrodger/nodezoo-npm.git
cd nodezoo-npm
npm install
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

```sh
npm run start OR npm run start-dev
```

When running in a local configuration, this service is exposed over
HTTP on port 9001.

Hosting and development is sponsored by [nearForm](http://nearform.com).

### Tagging and Logging

Options can be specified using '--' after 'npm run start'.

Tagging example:
```sh
npm run start --seneca.options.tag=npm
```

Logging example:
```sh
npm run start --seneca.log.all
```

## Contributing
The [NodeZoo](http://www.nodezoo.com/) org encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

## License
Copyright (c) 2015, Richard Rodgers and other contributors.
Licensed under [MIT](./LICENSE).
