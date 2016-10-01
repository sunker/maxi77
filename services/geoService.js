var Q = require('q');
var fs = require('fs');
var parsedJSON = require('../testcoordinates.json');

var geoService = {};

var counter = 0;
var coordinates;
var timestamp;

//return the coordinates from the GPS module in the rpi. but for now...
geoService.getCoordinates = function () {
  var defer = Q.defer();
  if (!coordinates) {
    coordinates = JSON.parse(fs.readFileSync('./testcoordinates.json', 'utf8').toString());
  }

  if (counter == 472) counter = 0;
  var coords = coordinates.gpx.wpt[counter];
  counter++;
  if (!timestamp) {
    timestamp = new Date();
  }
  timestamp.setSeconds(timestamp.getSeconds() + 15);
  defer.resolve({ lng: Number(coords.long), lat: Number(coords.lat), timestamp: timestamp.getTime() });

  return defer.promise;
};


module.exports = geoService;
