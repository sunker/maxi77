const Q = require('q'),
  geolib = require('geolib'),
  fs = require('fs'),
  Bancroft = require('bancroft'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;
let instance;

const GeoService = function () {
  const self = this;
  let currentCoord = {
      lat: 0,
      lng: 0,
      timestamp: 0
    },
    counter = 0,
    coordinates,
    timestamp;

  this.startGPSDListener = () => {
    const bancroft = new Bancroft();

    bancroft.on('connect', () => {
      console.log('GPIO connected');
    });

    bancroft.on('location', (location) => {
      if (isRealMovement(location)) {
        self.emit('gpsChanged', {
          lng: location.longitude,
          lat: location.latitude,
          timestamp: location.timestamp
        });
      }
    });

    bancroft.on('satellite', () => {});

    bancroft.on('disconnect', () => {
      console.log('GPIO disconnected');
    });
  };

  this.getNextCoordinateFromTestData = () => {
    const defer = Q.defer();
    if (!coordinates) {
      coordinates = JSON.parse(fs.readFileSync('./testcoordinates.json', 'utf8').toString());
    }

    if (counter === 472) counter = 0;
    const coords = coordinates.gpx.wpt[counter];
    counter++;
    if (!timestamp) {
      timestamp = new Date();
    }
    timestamp.setSeconds(timestamp.getSeconds() + 15);
    currentCoord = {
      lng: Number(coords.long),
      lat: Number(coords.lat),
      timestamp: timestamp.getTime()
    };
    self.emit('gpsChanged', currentCoord);
    defer.resolve(currentCoord);

    return defer.promise;
  };

  this.getCurrentCoordinate = () => {
    return currentCoord.lat === 0 && currentCoord.lng === 0 ? null : currentCoord;
  };

  this.getJourneyDistance = (array) => {
    if (array.length < 2) return 0.00;

    return geolib.getPathLength(
      array.map((x) => {
        return {
          'latitude': x.latitude,
          'longitude': x.longitude
        };
      })
    );
  };

  let isRealMovement = (location) => {
    if (location.latitude && location.longitude && location.speed) {
      const distance = geolib.getDistance({
        latitude: currentCoord.lat,
        longitude: currentCoord.lng
      }, {
        latitude: location.latitude,
        longitude: location.longitude
      }, 1, 3);

      //Only bother if the movement was larger than one meter
      if (distance > 1) {
        const newCoord = {
          lng: location.longitude,
          lat: location.latitude,
          timestamp: location.timestamp
        };
        currentCoord = newCoord;
        return true;
      }
    }

    return false;
  };
};

util.inherits(GeoService, EventEmitter);

module.exports = {
  getInstance: function () {
    return instance || (instance = new GeoService());
  }
};