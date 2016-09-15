var Q = require('q');
var Journey = require('../models/journey.js');

var journeyService = {};

var counter = 0;
var coordinates;

journeyService.getCurrentJourney = function () {
  var defer = Q.defer();

  var currentJourney = Journey.find({ stopped_at: !undefined }, function (err, journey) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(Journey);
    }
  });

  return defer.promise;
};

journeyService.createJourney = function (startCoordinates) {
  var defer = Q.defer();

  var newJourney = Journey({
    startCoordinates: { latitude: startCoordinates.lat, longitude: startCoordinates.long }
  });

  newJourney.save(function (err) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve();
      console.log("Journey created");
    }
  });

  return defer.promise;
};


module.exports = journeyService;
