'use strict';

var Datastore = require('nedb'),

devicesDb = new Datastore({
     filename: __dirname + '/../../db/devices.db',
     autoload: true
});

module.exports = devicesDb;
