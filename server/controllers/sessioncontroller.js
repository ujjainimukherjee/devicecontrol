const bcrypt = require('bcryptjs');
const usersModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config');

exports.session_login_on_post = function(req, res) {
    const postData = req.body,
    validationError = { type: 'Validation Error', message: '' };
    if (!postData.username) {
        validationError.message = 'User Name is required';
    } else if(!postData.password) {
        validationError.message = 'Password is required';
    }
    if (validationError.message) {
        res.status(400).json(validationError);
        return;
    }
    usersModel.findOne({ username: postData.username }, function(err, user) {
        if (err) {
            res.status(500).send(err);
            console.log('Error finding user');
            return;
        }
        if (user === null) {
            res.status(404).json({ auth: false,
                       message: 'No user with "username" of "'
                       + postData.username + '".' });
            return;
        }
        // check if password matches
        if (!bcrypt.compareSync(postData.password, user.password)) {
            console.log('Password not matching');
            res.status(401).json({ auth: false,
                       message: 'password not correct' });
            return;
        }
        console.log('login successful');
        var token = jwt.sign({ "id": user._id, "role": user.role }, config.salt, {
                expiresIn: 30000 // expires after interval
        });
        // if yes, send success and role from database
        res.status(200).json({ auth: true, token: token,
                   role: user.role });
    });
};

exports.session_logout_on_delete = function(req, res) {
    res.status(200).json({ auth: false, token: null });
};
