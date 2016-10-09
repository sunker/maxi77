var Q = require('q');
var geolib = require('geolib');
var fs = require('fs');
var Bancroft = require('bancroft');
var parsedJSON = require('../testcoordinates.json');

var geoService = {};

var currentCoord = { lat: 0, lng: 0, timestamp: 0 };
var counter = 0;
var coordinates;
var timestamp;

geoService.getCurrentCoordinate = function() {
  return currentCoord.lat === 0 && currentCoord.lng === 0 ? null : currentCoord;
};

geoService.startGPSDListener = function (updateCallback) {
  var bancroft = new Bancroft();

  bancroft.on('connect', function () {
    console.log('connected');
  });

  bancroft.on('location', function (location) {
    if (isRealMovement(location)){
      updateCallback( { lng: location.longitude, lat: location.latitude, timestamp: location.timestamp })
    }
  });

  bancroft.on('satellite', function (satellite) {
  });

  bancroft.on('disconnect', function (err) {
    console.log('disconnected');
    //If disconnected, for now we consider it being debug mode. so just use looped test data coordinates
    setInterval(function () {
      getNextCoordinateFromTestData().then(function (data) {
        updateCallback(data);
      });
    }, 1500);
  })
};

geoService.getNextCoordinateFromTestData = function () {
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

var isRealMovement = function(location) {
  if (location.latitude && location.longitude && location.speed) {
      var distance = geolib.getDistance({ latitude: currentCoord.lat, longitude: currentCoord.lng },
        { latitude: location.latitude, longitude: location.longitude }, 1, 3);

      //Only bother if the movement was larger than one meter
      if (distance > 1) { 
        var newCoord = { lng: location.longitude, lat: location.latitude, timestamp: location.timestamp };
        currentCoord = newCoord;
        return true;
      }
    }
    
    return false;
};

module.exports = geoService;
