var Q = require('q');
var fs = require('fs');
var parsedJSON = require('../testcoordinates.json');

var geoService = {};

var counter = 0;
var coordinates;

//return the coordinates from the GPS module in the rpi. but for now...
geoService.getCoordinates = function () {
  var defer = Q.defer();
  if (!coordinates) {
    coordinates = JSON.parse(fs.readFileSync('./testcoordinates.json', 'utf8').toString());//, function (err, data) {
  }

  if (counter == 472) counter = 0;
  var coords = coordinates.gpx.wpt[counter];
  counter++;
  defer.resolve({ long: Number(coords.long), lat: Number(coords.lat) });

  return defer.promise;
};


module.exports = geoService;
