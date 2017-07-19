var express = require('express');
var router = express.Router();
var User = require('./models/User');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/main');
var path = require('path');


router.get('/', (req, res) =>{
        res.sendFile(path.resolve(__dirname + '/../client/index.html'));
    });

// The Registration Route
// Takes email and password
router.post('/api/v1/register', (req, res) => {

    if(!req.body.email || !req.body.password){
        console.log(req.body);
        res.json({success: false, message: 'Please include all data'});
    }
    else{
        var newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        newUser.save((err) => {
            if(err) {
                return res.status(200).json({success: false, message: err.message});
            }
            else{
                res.status(200).json({success: true, message: 'Successfully created the user'});
            }
        });
    }
});

// Authetication Route
// Handles giving out the token based on whether
// user successfully authenticated or not
router.post('/api/v1/authenticate', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            res.send({success: false, message: 'Authentication failed! User not found'});
        } else{
            // Check if the password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if(isMatch && !err){
                    // Create the token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 3600 // time in seconds (1 hour)
                    });

                    res.status(200).json({success: true, token: 'JWT ' + token});
                }
                else{
                    console.log(err);
                    res.status(200).send({success: false, message: 'Authentication failed: Password didn\'t match'});
                }
            });
        }
    });
});

// Random protected route to test
router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('User id is: ' + req.user._id);
});

module.exports = router;
