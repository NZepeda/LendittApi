var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Controllers
var authController = require('./controllers/authenticationController');

router.get('/', (req, res) =>{
        res.sendFile(path.resolve(__dirname + '/../client/index.html'));
    });

// The Registration Route
// Takes email and password
router.post('/api/v1/register', authController.register);

// Authetication Route
// Handles giving out the token based on whether
// user successfully authenticated or not
router.post('/api/v1/authenticate',  authController.authenticate);

// Random protected route to test
router.get('/dashboard', passport.authenticate('jwt', {session: false}), authController.getUserData);

module.exports = router;
