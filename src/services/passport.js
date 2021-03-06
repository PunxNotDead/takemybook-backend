'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const _ = require('lodash');

const User = require('../services/mongoose').model('User');
const config = require('../config');

/*
id: '105080940982166248318',
displayName: 'My Name',
name: { familyName: 'Name', givenName: 'My' },
emails: [ { value: 'x@gmail.com', type: 'account' } ],
photos: [ { value: 'https://lh4.googleusercontent.com/-WB-_FDult10/AAAAAAAAAAI/AAAAAAAAAFQ/eXbqkKUUU9k/photo.jpg?sz=50' } ],
gender: 'male',
provider: 'google'
*/

function extractGoogleProfile(profile) {
	let email = null;

	if (profile.emails) {
		let filteredEmail = _.find(profile.emails, email => email.type === 'account');
		email = filteredEmail ? filteredEmail.value : null;
	}

	return {
		id: profile.id,
		name: profile.displayName,
		email: email
	};
}

function extractFacebookProfile(profile) {
	return {
		id: profile.id,
		name: profile.displayName,
		email: profile.email
	};
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
	clientID: config.get('googleClientApiId'),
	clientSecret: config.get('googleClientApiSecret'),
	callbackURL: '/api/google/callback',
	accessType: 'offline'
}, (accessToken, refreshToken, profile, done) => {
	const userData = extractGoogleProfile(profile);

	User.findOne({
		email: userData.email
	}).then(user => {
		if (user === null) {
			user = new User();
			user.name = userData.name;
			user.googleId = userData.id;
			user.email = userData.email;
			user.active = true;

			user.save().then(() => done(null, user)).catch(console.log);
		} else {
			done(null, user);
		}
	});
}));

passport.use(new FacebookStrategy({
		clientID: config.get('facebookClientAppId'),
		clientSecret: config.get('facebookClientApiSecret'),
		callbackURL: '/api/facebook/callback'
	},

	(token, refreshToken, profile, done) => {
		const userData = extractFacebookProfile(profile);

		User.findOne({
			facebookId: userData.id
		}).then(user => {
			if (user === null) {
				user = new User();
				user.name = userData.name;
				user.facebookId = userData.id;
				user.email = userData.email;
				user.active = true;

				user.save().then(() => done(null, user)).catch(console.log);
			} else {
				done(null, user);
			}
		});
	})
);

passport.use('user', new LocalStrategy({
	usernameField: 'email'
},
	(email, password, done) => {
		User.findOne({
			email: email
		}).then(user => {
			if (!user) {
				return done(null, false, {
					message: 'Неправильное имя пользователя'
				});
			}

			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'Неправильный пароль'
				});
			}

			return done(null, user);
		});
	}
));

passport.serializeUser((user, done) => {
	done(null, {
		id: user.id
	});
});

passport.deserializeUser((serializedUser, done) => {
	User.findById(serializedUser.id, (err, user) => {
		done(err, user);
	});
});

module.exports = passport;
