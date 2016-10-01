var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var coordinateSchema = new Schema({
    journeyId : { type: Schema.ObjectId, ref: 'trip' },
    latitude: Number, 
    longitude: Number,
    timestamp: Date,
    is_MOB: Boolean, default: false,
});

var Coordinate = mongoose.model('coordinate', coordinateSchema);

module.exports = Coordinate;