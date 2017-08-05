'use strict';

const passport = require('../services/passport');

function loginGoogle(req, res, next) {
	if (req.query.return) {
		req.session.oauth2return = req.query.return;
	}

	// Start OAuth 2 flow using Passport.js
	passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next)
}

exports.loginGoogle = loginGoogle;
