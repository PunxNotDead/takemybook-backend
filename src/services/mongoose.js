'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config');

mongoose.Promise = bluebird;

mongoose.connect(config.get('mongodb:host'), config.get('mongodb:mongooseOptions') || {});

mongoose.model('User', require('../schemas/user'), 'users');

module.exports = mongoose;
