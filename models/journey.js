var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var journeySchema = new Schema({
    id: {
        type: Schema.ObjectId
    },
    created_at: Date,
    distance: Number,
    zoom_level: Number,
    stopped: Boolean,
    default: false,
    coordinates: []
});

// journeySchema.pre('save', true, function(next, done){
//     var currentDate = new Date();
//     this.created_at = currentDate;

//     if (!this.created_at)
//         this.created_at = currentDate;

//     next();
// });

journeySchema.methods = {
    stop: function () {
        var defer = Q.defer();
        var journey = this;
        this.stopped = true;
        this.save(function (err) {
            if (err) console.log(err);;
            console.log('Journey successfully stopped!');
            defer.resolve(journey);
        });

        return defer.promise;
    },
    addCoordinate: function (coordinate) {
        var defer = Q.defer();
        this.coordinates.push({
            latitude: coordinate.lat,
            longitude: coordinate.lng,
            timestamp: coordinate.timestamp,
            is_MOB: coordinate.isMob
        });

        this.save(function (err, journey) {
            if (err) console.log(err);;
            defer.resolve(journey);
        });

        return defer.promise;
    },
    updateDistance: function (meters) {
        var defer = Q.defer();
        var journey = this;
        this.distance = meters;
        this.save(function (err) {
            if (err) console.log(err);
            defer.resolve(journey);
        });

        return defer.promise;
    },
    updateZoomLevel: function (zoomLevel) {
        var defer = Q.defer();
        this.zoom_level = zoomLevel;
        this.save(function (err, journey) {
            if (err) console.log(err);
            defer.resolve(journey);
        });

        return defer.promise;
    }
};

journeySchema.statics = {
    getById: function (journeyId) {
        var defer = Q.defer();
        Journey.findById(journeyId, function (err, journey) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(journey);
            }
        });

        return defer.promise;
    },
    create: function (startCoordinates) {
        var defer = Q.defer();

        var startCoordinate = {
            latitude: startCoordinates.lat,
            longitude: startCoordinates.lng,
            timestamp: startCoordinates.timestamp,
            is_MOB: false
        };

        var newJourney = Journey({
            created_at: new Date(),
            stopped: false,
            distance: 0.00,
            zoom_level: 10, //Should be arg from client?,
            coordinates: [startCoordinate]
        });

        newJourney.save(function (err, journey) {
            if (err) {
                console.log(err);
                defer.reject(err);
            } else {
                defer.resolve(journey);
                console.log('Journey created');
            }
        });

        return defer.promise;
    },
    getCurrentJourney: function () {
        var defer = Q.defer();
        this.find({
            'stopped': false
        }, function (err, journey) {
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
    }
};

var Journey = mongoose.model('trip', journeySchema);

module.exports = Journey;