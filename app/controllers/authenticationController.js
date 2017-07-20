var User = require('../models/User');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../../config/main');
var path = require('path');


exports.register = (req, res) => {

     if(!req.body.email || !req.body.password){
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
}

exports.authenticate = (req, res) => {
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
                        expiresIn: 86400
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
} 

exports.getUserData = (req, res) => {
    res.status.send({"userId": req.user._id});
}