const router = require('express').Router();


const user = require('./controllers/user_controller');

router.get('/users/list', user.list);

module.exports = router;
