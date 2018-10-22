var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/usercontroller');
var adminAccess = require('../controllers/adminAccess');

// GET user home page.
router.get('/', user_controller.user_list);
//
// POST request for creating user.
router.post('/', adminAccess, user_controller.user_add_on_post);

// DELETE request to delete user.
router.delete('/:id', adminAccess, user_controller.user_remove_on_delete);

// PUT request to update user.
router.put('/:id', user_controller.user_update_on_put);

// GET request for one user.
router.get('/:id', user_controller.user_detail);

module.exports = router
