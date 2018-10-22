var express = require('express');
var router = express.Router();

var device_controller = require('../controllers/devicecontroller');
var adminAccess = require('../controllers/adminAccess');

// GET device home page.
//router.get('/', adminAccess, device_controller.device_list);
router.get('/', device_controller.device_list);

// POST request for creating device.
router.post('/', adminAccess, device_controller.device_add_on_post);

// DELETE request to delete device.
router.delete('/:id', adminAccess, device_controller.device_remove_on_delete);

// PUT request to update device.
router.put('/:id', adminAccess, device_controller.device_update_on_put);

// GET request for one device.
router.get('/:id', device_controller.device_detail);

module.exports = router
