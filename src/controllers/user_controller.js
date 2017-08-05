'use strict';

const User = require('../services/mongoose').model('User');

function googleCallback(req, res) {
	const redirect = req.session.oauth2return || '/';
	delete req.session.oauth2returnА;
	res.redirect(redirect);
}

exports.googleCallback = googleCallback;
