var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var journeySchema = new Schema({
    id: {
        type: String, default: function genUUID() {
            uuid.v1()
        }
    },
    startCoordinate: { latitude: Number, longitude: Number },
    created_at: Date,
    stopped_at: Date
});

journeySchema.pre('save', function () {
    var currentDate = new Date();
    this.created_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Journey = mongoose.model('Journey', journeySchema);

module.exports = Journey;