var express = require('express');
var router = express.Router();
var authToken = require('../controllers/authToken');

var session_controller = require('../controllers/sessioncontroller');

// GET could get the login page

// POST request for login
router.post('/', session_controller.session_login_on_post);

// DELETE request for logout
router.delete('/', authToken, session_controller.session_logout_on_delete);

module.exports = router
