var Q = require('q');
var Journey = require('../models/journey');
var Coordinate = require('../models/coordinate');

var journeyRepository = {};

var counter = 0;
var coordinates;

journeyRepository.getCurrentJourney = function () {
    var defer = Q.defer();

    Journey.find({ "stopped": false }, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            if (journey.length !== 0) {
                var currentJourney = journey[0];
                defer.resolve(currentJourney);
            } else {
                defer.resolve(journey.length === 0 ? null : journey[0]);
            }
        }
    });

    return defer.promise;
};

journeyRepository.stopJourney = function (journeyId) {
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

journeyRepository.addCoordinate = function (journeyId, coordinate) {
    var defer = Q.defer();

    var newCoordinate = Coordinate({
        latitude: coordinate.lat,
        longitude: coordinate.lng,
        timestamp: coordinate.timestamp,
        journeyId: journeyId,
        is_MOB: coordinate.isMob
    });

    Journey.findById(journeyId, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            journey.coordinates.push(newCoordinate);
            journey.save(function (err) {
                if (err) console.log(err);;
                // console.log('Journey successfully stopped!');
                defer.resolve(journey);
            });
        }
    });
    return defer.promise;
}

journeyRepository.updateDistance = function (journeyId, meters) {
    var defer = Q.defer();
    Journey.findById(journeyId, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            journey.distance = journey.distance + meters;
            journey.save(function (err) {
                if (err) console.log(err);
                // console.log('Journey distance updated!');
                defer.resolve(journey);
            });
        }
    });

    return defer.promise;
};

journeyRepository.updateZoomLevel = function (journeyId, zoomLevel) {
    var defer = Q.defer();
    Journey.findById(journeyId, function (err, journey) {
        if (err) {
            console.log(err);
            defer.reject(err);
        } else {
            journey.zoom_level = zoomLevel;
            journey.save(function (err) {
                if (err) console.log(err);
                // console.log('Journey distance updated!');
                defer.resolve(journey);
            });
        }
    });

    return defer.promise;
};

journeyRepository.createJourney = function (startCoordinates) {
    var defer = Q.defer();

    var startCoordinate = Coordinate({
        latitude: startCoordinates.lat,
        longitude: startCoordinates.lng,
        timestamp: startCoordinates.timestamp,
        is_MOB: false
    });

    var newJourney = Journey({
        created_at: new Date(),
        stopped: false,
        distance: 0.00,
        zoom_level: 10, //Should be arg from client?,
        coordinates: [startCoordinate]
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

module.exports = journeyRepository;
