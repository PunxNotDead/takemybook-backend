const router = require('express').Router();

const user = require('./controllers/user_controller');
const site = require('./controllers/site_controller');
const passport = require('./services/passport');

router.get('/google/callback', passport.authenticate('google'), user.googleCallback);
router.get('/login/google', site.loginGoogle);


router.get('/facebook/callback', passport.authenticate('facebook'), user.facebookCallback);
router.get('/login/facebook', site.loginFacebook);

module.exports = router;
