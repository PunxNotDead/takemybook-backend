'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressDomainMiddleware = require('express-domain-middleware');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var apiRouter = require('./src/api_router');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(expressDomainMiddleware);
//app.use(busboy());
app.use(express.static('static'));

app.use(cookieParser());
app.use(session({
	secret: 'afdsafdsafwqdaqdasd', // session secret
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
	res.status(500).send({
		errors: [ err.toString() ]
	});
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('TakeMyBook listening at http://%s:%s', host, port);
});
