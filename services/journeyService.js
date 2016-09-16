var Q = require('q');
var Journey = require('../models/journey');

var journeyService = {};

var counter = 0;
var coordinates;

journeyService.getCurrentJourney = function () {
    var defer = Q.defer();

    Journey.find({ "stopped": false }, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            defer.resolve(journey.length === 0 ? null : journey[0]);
        }
    });

    return defer.promise;
};

journeyService.stopJourney = function (journeyId) {
    var defer = Q.defer();

    Journey.findById(journeyId, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            journey.stopped = true;
            journey.save(function (err) {
                if (err) console.log(err);;
                console.log('Journey successfully stopped!');
                defer.resolve(journey);
            });            
        }
    });

    return defer.promise;
};

journeyService.createJourney = function (startCoordinates) {
    var defer = Q.defer();

    var newJourney = Journey({
        startCoordinate: { latitude: startCoordinates.lat, longitude: startCoordinates.long },
        created_at: new Date(),
        stopped: false
    });

    newJourney.save(function (err, journey, numAffected) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            defer.resolve(journey);
            console.log("Journey created");
        }
    });

    return defer.promise;
};


module.exports = journeyService;
