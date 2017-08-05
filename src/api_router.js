const router = require('express').Router();

const user = require('./controllers/user_controller');
const site = require('./controllers/site_controller');
const passport = require('./services/passport');

router.get('/google/callback', passport.authenticate('google'), user.googleCallback);
router.get('/login/google', site.loginGoogle);

module.exports = router;
