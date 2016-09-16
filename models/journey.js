var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var journeySchema = new Schema({
    // id: { type: Schema.ObjectId, unique: true, index: true },
    id: { type: Schema.ObjectId},
    startCoordinate: { latitude: Number, longitude: Number },
    created_at: Date,
    stopped: Boolean, default: false
});

// journeySchema.pre('save', true, function(next, done){
//     var currentDate = new Date();
//     this.created_at = currentDate;

//     if (!this.created_at)
//         this.created_at = currentDate;

//     next();
// });

var Journey = mongoose.model('trip', journeySchema);

module.exports = Journey;