![logo-nodezoo][Logo]

# nodezoo-npm

- __Lead:__ [Dean McDonnell][Lead]
- __Sponsor:__ [nearForm][]

A micro-service that provides [npm][] data for [NodeZoo][]. This micro-service depends
on the npm registry but also caches retrieved data to reduce load on the public
registry.

If you're using this microservice, and need help, you can:

- Post a [github issue][],
- Tweet to [@nodezoo][],
- Ask on the [Gitter][gitter-url].

## Running
This micro-service can be ran as part of a complete system or as a single isolated
unit.

### As a complete system
A special system repository is available that runs the complete system using Docker
and Fuge.

- [Nodezoo: The complete system][System]

### Isolated mode
To make testing easier this micro-service can be ran in 'isolated' mode. This mode
allows testing over http using a well defined port. Please note isolated mode means
patterns are not exposed via mesh.

To run in isolated mode,

 - Clone this repository locally,
 - Run `npm install`,
 - Run `npm start isolated`,

__Note:__ In memory storage is used over redis in isolated mode.

A simple http service is supported and can be called using Curl or other Rest client.
The default port is `8052`. It can be changed using the `NPM_PORT` environment
variable.

```
curl -d '{"role":"npm","cmd":"get","name":"hapi"}' http://localhost:8052/act
```

## Configuration

### Environment Variables
Various settings can be changed using environment variables, see the list below for
all available variable names.

#### NPM_HOST
  - The host to listen on in isolated mode.
  - Defaults to `localhost`

#### NPM_PORT
  - The port to listen on in isolated mode.
  - Defaults to `8051` .

#### NPM_REDIS_HOST
  - The host redis will listen on.
  - Defaults to `localhost`

#### NPM_REDIS_PORT
  - The port redis listen on.
  - Defaults to `6379` .

#### NPM_ISOLATED
  - Starts isolated mode.
  - Defaults to `false`.

#### NPM_REGISTRY
  - Change the registry used to validate the module name.
  - Defaults to `http://registry.npmjs.org/`.

## Sample Data
```json
{
  "entity$": "-/-/npm_cache",
  "id": "nodezoo-npm",
  "name": "nodezoo-npm",
  "urlRepo": "git+https://github.com/nodezoo/nodezoo-npm.git",
  "urlPkg": "https://www.npmjs.com/package/nodezoo-npm",
  "description": "A microservice that handles npm data for nodezoo.com",
  "latestVersion": "6.0.0",
  "releaseCount": 1,
  "dependencies": {
    "request": "2.70.x",
    "seneca": "2.0.x",
    "seneca-balance-client": "0.4.x",
    "seneca-mesh": "0.7.x",
    "seneca-entity": "0.0.x",
    "toolbag": "2.0.x",
    "toolbag-plugin-stats-collector": "1.0.x",
    "toolbag-plugin-udp-reporter": "1.0.x"
  },
  "author": {
    "name": "Richard Rodger",
    "email": ""
  },
  "licence": "MIT",
  "maintainers": [
    {
      "name": "adrianrossouw",
      "email": ""
    },
    {
      "name": "mcdonnelldean",
      "email": ""
    }
  ],
  "readme": "...",
  "homepage": "https://github.com/nodezoo/nodezoo-npm#readme",
  "cached": 1460320210380
}
```

## Messages Handled

### `role:npm,cmd:get`
Returns npm specific data for the module name provided.

```js
seneca.act(`role:npm,cmd:get`, {name:'seneca'}, (err, data) => {})
```

### `role:info,req:part`
An alias for `role:npm,cmd:get`, allows integration into the wider nodezoo-system.

```js
seneca.act(`role:info,req:part`, {name:'seneca'}, (err, reply) => {})
```

## Messages Emitted

### `role:info,res:part`

Called in response to a call to `role:info,req:part`.

```js
seneca.add(`role:info,res:part`, (msg, done) => {})
```

## Contributing
The [NodeZoo org][] encourages __open__ and __safe__ participation.

- __[Code of Conduct][CoC]__

If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.


## License
Copyright (c) 2014 - 2016, Richard Rodger and other contributors.
Licensed under [MIT][].

[CoC]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[Logo]: https://raw.githubusercontent.com/nodezoo/nodezoo-org/master/assets/logo-nodezoo.png
[NPM]: http://npmjs.org
[NodeZoo]: https://github.com/rjrodger/nodezoo
[nearForm]: http://nearform.com
[Lead]: https://github.com/rjrodger
[NodeZoo org]: https://github.com/nodezoo
[MIT]: ./LICENSE
[github issue]: https://github.com/nodezoo/nodezoo-npm/issues
[@nodezoo]: http://twitter.com/nodezoo
[gitter-url]: https://gitter.im/nodezoo/nodezoo-org
[System]: https://github.com/nodezoo/nodezoo-system
