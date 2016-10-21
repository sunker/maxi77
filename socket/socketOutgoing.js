var journeyRepository = require("../services/journeyRepository");
var GeoService = require("../services/geoService");
var WeatherService = require("../services/weatherService");

module.exports = function (io) {
    var geoService = GeoService.getInstance();
    var weatherService = WeatherService.getInstance();

    //Server events
    geoService.on('gpsChanged', function (coords) {
        io.sockets.emit('coordinatesUpdated', { coordinates: coords });
        console.log(coords);
        journeyRepository.getCurrentJourney().then(function (data) {
            if (data) {
                coords.isMob = false;
                journeyRepository.addCoordinate(data._id, coords).then(function (journey) {
                    var distance = geoService.getJourneyDistance(journey.coordinates);
                    journeyRepository.updateDistance(data._id, distance).then(function (journey) {
                        io.sockets.emit('journeyDistanceUpdated', { journey });
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