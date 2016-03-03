![logo-nodezoo][Logo]
​
# nodezoo-npm
​
- __Lead:__ [Richard Rodger][Lead]
- __Sponsor:__ [nearForm][]
​
The _nodezoo-npm_ micro-service provides an interface to the
[NPM][] registry as part of the [NodeZoo][] system.
​
## Install
1. Clone this repo into a root _/nodezoo_ folder.
2. Run `npm install`
​
## Starting
To start simply run,
​
```
npm run start OR npm run start:dev
```
​
### Tagging and Logs
To tag or set up logs for your service pass the relevant switches on start,
​
```
npm run start -- --seneca.options.tag=npm --seneca.log.all
```
​
## Inbound Messages
This micro-service recognizes the following messages:
​
   * _role:npm,cmd:get_ - get module details by name
   * _role:npm,cmd:query_ - query module details from NPM
   * _role:npm,cmd:extract_ - extract relevant data from NPM result
​
## Outbound Messages
This micro-service issues the following message:
​
   * _role:search,cmd:insert_ - insert module details into search engine index, OPTIONAL
​
It overrides this message:
​
   * _role:entity,cmd:save,name:npm_ - insert module details into search engine in parallel to save
​
## Running with Curl
The messages above can also be sent using curl in the following format in the command line,
​
```
curl -d '{"role":"npm","cmd":"get","name":"seneca","update":true}' http://localhost:52868/act
```
__Note__: Ports are assigned automatically, please check the logs for the correct port to use.
​
## Contributing
The [NodeZoo org][] encourages __open__ and __safe__ participation.
​
- __[Code of Conduct][CoC]__
​
If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.
​
## License
Copyright (c) 2014 - 2016, Richard Rodger and other contributors.
Licensed under [MIT][].
​
[CoC]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[Logo]: https://github.com/nodezoo/nodezoo-org/blob/master/assets/logo-nodezoo.png
[NPM]: http://npmjs.org
[NodeZoo]: https://github.com/rjrodger/nodezoo
[nearForm]: http://nearform.com
[Lead]: https://github.com/rjrodger
[NodeZoo org]: https://github.com/nodezoo
[MIT]: ./LICENSE
