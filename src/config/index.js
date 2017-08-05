'use strict';

// Defaults configuration to development if not provided
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const nconf = require('nconf');

const defaults = require('./default.json');

const env = process.env.NODE_ENV;

nconf.use('memory');

console.log('Configuring environment from %s.json', env);

// Initializes and sets up nconf

nconf.argv()
	.env()
	.file('environmentConfig', path.join(__dirname, `${env}.json`))
	.defaults(defaults);

switch (env) {
	case 'development': {
		nconf.get('log:streams').push({
			level: 'info',
			stream: process.stdout
		});
		break;
	}
}

module.exports = nconf;
