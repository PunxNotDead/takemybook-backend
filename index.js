'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressDomainMiddleware = require('express-domain-middleware');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

const apiRouter = require('./src/api_router');
const config = require('./src/config');

const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(expressDomainMiddleware);
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

const server = app.listen(config.get('port'), function() {
	const host = server.address().address;
	const port = server.address().port;

	console.log('TakeMyBook listening at http://%s:%s', host, port);
});
