'use strict';

function generateErrorHandler(res, message) {
	return function(e) {
		res.status(500).json(createError(message));
	};
}

function defaultErrorHandler(res) {
	return function(e) {
		res.status(e.status || 500).json(createError(e.message));
	};
}

function createError(message) {
	return {
		error: message
	};
}

exports.generateErrorHandler = generateErrorHandler;
exports.defaultErrorHandler = defaultErrorHandler;
exports.createError = createError;
