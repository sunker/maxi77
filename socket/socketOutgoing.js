var GeoService = require("../services/geoService");
var WeatherService = require("../services/weatherService");
const mongoose = require('mongoose');
var Journey = mongoose.model('trip');

module.exports = function (io) {
    var geoService = GeoService.getInstance();
    var weatherService = WeatherService.getInstance();

    //Server events
    geoService.on('gpsChanged', function (coords) {
        io.sockets.emit('coordinatesUpdated', { coordinates: coords });
        console.log(coords);
        Journey.getCurrentJourney().then(function (journey) {
            if (journey) {
                coords.isMob = false;
                journey.addCoordinate(coords).then(function (journey2) {
                    var distance = geoService.getJourneyDistance(journey2.coordinates);
                    journey2.updateDistance(distance).then(function (journey3) {
                        io.sockets.emit('journeyDistanceUpdated', { distance: journey3.distance });
                    });
                });
            }
        });
    });

    weatherService.on('weatherForecastUpdated', function (forecast) {
        io.sockets.emit('forecastUpdated', forecast);
    });

    weatherService.on('weatherForecastUpdateFailed', function (forecast) {
        io.sockets.emit('forecastUpdatedFailed', forecast);
    });
};
