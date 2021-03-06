const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Q = require('q');

const journeySchema = new Schema({
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
//     const currentDate = new Date();
//     this.created_at = currentDate;

//     if (!this.created_at)
//         this.created_at = currentDate;

//     next();
// });

journeySchema.methods = {
    stop: function () {
        const defer = Q.defer();
        const journey = this;
        this.stopped = true;
        this.save(function (err) {
            if (err) console.log(err);;
            console.log('Journey successfully stopped!');
            defer.resolve(journey);
        });

        return defer.promise;
    },
    addCoordinate: function (coordinate) {
        const defer = Q.defer();
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
        const defer = Q.defer();
        const journey = this;
        this.distance = meters;
        this.save(function (err) {
            if (err) console.log(err);
            defer.resolve(journey);
        });

        return defer.promise;
    },
    updateZoomLevel: function (zoomLevel) {
        const defer = Q.defer();
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
        const defer = Q.defer();
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
        const defer = Q.defer();

        const startCoordinate = {
            latitude: startCoordinates.lat,
            longitude: startCoordinates.lng,
            timestamp: startCoordinates.timestamp,
            is_MOB: false
        };

        const newJourney = Journey({
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
        const defer = Q.defer();
        this.find({
            'stopped': false
        }, function (err, journey) {
            if (err) {
                console.log(err);
                defer.reject(err);
            } else {
                if (journey.length !== 0) {
                    const currentJourney = journey[0];
                    defer.resolve(currentJourney);
                } else {
                    defer.resolve(journey.length === 0 ? null : journey[0]);
                }
            }
        });

        return defer.promise;
    }
};

const Journey = mongoose.model('trip', journeySchema);

module.exports = Journey;