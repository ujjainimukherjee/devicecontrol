const express = require('express');
const router = express.Router();

const authToken = require('../controllers/authToken');
const session_controller = require('../controllers/sessioncontroller');

// POST request for login
router.post('/', session_controller.session_login_on_post);

// DELETE request for logout
router.delete('/', authToken, session_controller.session_logout_on_delete);

module.exports = router
