'use strict';

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.status(403).send({
		error: 'Not Authenticated'
	});
}

exports.ensureAuthenticated = ensureAuthenticated;
