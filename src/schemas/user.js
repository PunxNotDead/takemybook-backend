/* eslint no-invalid-this: 0 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const crypto = require('crypto');

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	googleId: {
		type: String,
		unique: true,
		trim: true
	},
	passwordHash: String,
	registrationDate: Date,
	active: {
		type: Boolean,
		default: false
	},
	salt: {
		type: String,
		default: ''
	}
});

UserSchema.pre('save', function(next) {
	if (this.isNew) {
		this.registrationDate = moment().toISOString();
	}

	next();
});

UserSchema.on('index', function(err) {
	console.log(err);
});

UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.passwordHash = this.hashPassword(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema.methods.hashPassword = function(password) {
	if (!password) {
		return '';
	}

	try {
		return crypto
			.createHmac('sha1', this.salt)
			.update(password)
			.digest('hex');
	} catch (err) {
		return '';
	}
};

UserSchema.methods.authenticate = function(plainText) {
	return this.hashPassword(plainText) === this.passwordHash;
};

UserSchema.methods.makeSalt = function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
};

module.exports = UserSchema;
