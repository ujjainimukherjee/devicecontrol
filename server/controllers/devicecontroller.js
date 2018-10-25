// Any control logic & use of data model should be added here
const devicesModel = require('../models/deviceModel.js');

exports.index = function(req, res) {
      res.send('NOT IMPLEMENTED: Site Home Page');
};
// Display list of all devices.
exports.device_list = function(req, res) {
     devicesModel.find({}, function(err, alldevices) {
         if (err) {
             res.send(err);
             return;
         }
         res.json({devices: alldevices});
     });
};
// Handle device create on POST.
exports.device_add_on_post = function(req, res) {
    var postData = req.body,
    validationError = { type: 'Validation Error', message: '' };
    if (!postData.devicename) {
        validationError.message = 'Device Name is required';
    }
    if (validationError.message) {
        res.json(validationError);
        return;
    }
    devicesModel.findOne({ devicename: postData.devicename }, function(err, device) {
        if (err) {
            res.status(500).send(err);
            console.log('Error finding device');
            return;
        }
        if (device) {
            res.status(409).json({ type: 'error',
                       message: 'Device already exists with "devicename" of "'
                       + postData.devicename + '".' });
            return;
        }
        if (device === null) {
            devicesModel.insert(postData, function(err, newDevice) {
                if (err) {
                    res.send(err);
                    return;
                }
                console.log(newDevice);
                res.status(201).json(newDevice);
            });
        }
    });
};

// Display detail page for a specific device.
exports.device_detail = function(req, res) {
     devicesModel.findOne({ _id: req.params.id }, function(err, device) {
         if (err) {
             res.send(err);
             return;
         }

         if (device === null) {
             res.json({ type: 'error',
                        message: 'Did not find a user with "id" of "'
                        + req.params.id + '".' });
             return;
         }

         res.json(device);
     });
};

// Handle device update on PUT.
exports.device_update_on_put = function(req, res) {
     devicesModel.findOne({ _id: req.params.id }, function(err, device) {
          var prop;

          if (err) {
              res.send(err);
              return;
          }
          if (device === null) {
              res.json({ type: 'error',
                         message: 'Did not find a device with "id" of "'
                         + req.params.id + '".' });
              return;
          }
          console.log('hello here!');
          for (prop in req.body) {
              if (prop !== '_id') {
                  console.log('her i am');
                  //console.log(`Put for property ${prop} of device ${req.params.id}`);
                  device[prop] = req.body[prop];
              }
          }
          devicesModel.update({ _id: device._id }, device, {}, function(err, numReplaced) {
              if (err) {
                  res.send(err);
                  return;
              }

              res.json({ type: 'success', message: 'Replaced ' + numReplaced + ' device(s).' });
          });
     });
};

// Handle device delete on POST.
exports.device_remove_on_delete = function(req, res) {
     devicesModel.remove({ _id: req.params.id }, function(err, device) {
         if (err) {
             res.send(err);
         }

         res.json({ type: 'success',
                    message: 'Successfully deleted device with id "'
                    + req.params.id + '".' });
     });
};
