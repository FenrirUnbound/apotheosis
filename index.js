require('node-env-file')('.env', {raise: false});
return require('./lib/server')();
