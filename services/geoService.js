var Q = require('q');
var geolib = require('geolib');
var fs = require('fs');
var Bancroft = require('bancroft');
var parsedJSON = require('../testcoordinates.json');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var instance;

var GeoService = function () {
  var self = this;
  var currentCoord = { lat: 0, lng: 0, timestamp: 0 };
  var counter = 0;
  var coordinates;
  var timestamp;

  this.startGPSDListener = function (updateCallback) {
    var bancroft = new Bancroft();

    bancroft.on('connect', function () {
      console.log('GPIO connected');
    });

    bancroft.on('location', function (location) {
      if (isRealMovement(location)) {
        updateCallback({ lng: location.longitude, lat: location.latitude, timestamp: location.timestamp });
        self.emit('gpsChanged', { lng: location.longitude, lat: location.latitude, timestamp: location.timestamp });
      }
    });

    bancroft.on('satellite', function (satellite) {
    });

    bancroft.on('disconnect', function (err) {
      console.log('GPIO disconnected');
    })
  };

  this.getNextCoordinateFromTestData = function () {
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
    currentCoord = { lng: Number(coords.long), lat: Number(coords.lat), timestamp: timestamp.getTime() };
    self.emit('gpsChanged', currentCoord);
    defer.resolve(currentCoord);

    return defer.promise;
  };

  this.getCurrentCoordinate = function () {
    return currentCoord.lat === 0 && currentCoord.lng === 0 ? null : currentCoord;
  };

  this.getJourneyDistance = function (array) {
    if (array.length < 2) return 0.00;

    return geolib.getPathLength(
      array.map(function (x) {
        return { 'latitude': x.latitude, 'longitude': x.longitude }
      })
    );
  };

  var isRealMovement = function (location) {
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
}

util.inherits(GeoService, EventEmitter);

module.exports = {
  getInstance: function(){
    return instance || (instance = new GeoService())
  }
};
