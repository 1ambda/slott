# Slott 

[![Build Status](https://travis-ci.org/1ambda/slott.svg?branch=master)](https://travis-ci.org/1ambda/slott) [![Coverage Status](https://coveralls.io/repos/github/1ambda/slott/badge.svg?branch=master)](https://coveralls.io/github/1ambda/slott?branch=master)

JSON Configured Stream-like Job Controller

<br/>

## Deployment

Use environment variables to configure constants (See [config.json](https://github.com/1ambda/slott/blob/master/src/constants/config.js))

```
SLOTT_TITLE=Controller
SLOTT_CONTAINERS='[{"name":"test","address":"http://172.0.1.30:8080"},{"name":"live","address":"http://172.0.2.30:8080"}]'
npm install
npm run build
```

## Development


```
$ npm test
$ npm start              # run with mock-server
```

See, [package.json](https://github.com/1ambda/slott/blob/master/package.json)
