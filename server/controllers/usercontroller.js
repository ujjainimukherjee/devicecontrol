const bcrypt = require('bcryptjs');

var usersModel = require('../models/userModel.js');

exports.user_list = function(req, res) {
      res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.user_add_on_post = function(req, res) {
    var postData = req.body,
    validationError = { type: 'Validation Error', message: '' };

    if (!postData.username) {
        validationError.message = 'User Name is required';
    } else if(!postData.password) {
        validationError.message = 'Password is required';
    } else if (!postData.role) {
        validationError.message = 'Role is required';
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
        if (user) {
            res.status(409).json({ type: 'error',
                       message: 'User already exists with "username" of "'
                       + postData.username + '".' });
            return;
        }
        if (user === null) {
            var hashedPassword = bcrypt.hashSync(postData.password, 8);
            var userData = { username: postData.username, password: hashedPassword, role: postData.role };
            usersModel.insert(userData, function(err, newUser) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log(newUser);
                res.status(201).json(newUser);
            });
        }
    });
};

exports.user_remove_on_delete = function(req, res) {
      res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.user_update_on_put = function(req, res) {
      res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.user_detail = function(req, res) {
      res.send('NOT IMPLEMENTED: Site Home Page');
};
