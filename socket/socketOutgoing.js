const GeoService = require('../services/geoService'),
    WeatherService = require('../services/weatherService'),
    mongoose = require('mongoose'),
    Journey = mongoose.model('trip');

module.exports = (io) => {
    const geoService = GeoService.getInstance(),
        weatherService = WeatherService.getInstance();

    //Server events
    geoService.on('gpsChanged', (coords) => {
        io.sockets.emit('coordinatesUpdated', { coordinates: coords });
        console.log(coords);
        Journey.getCurrentJourney().then((journey) => {
            if (journey) {
                coords.isMob = false;
                journey.addCoordinate(coords).then((journey2) => {
                    const distance = geoService.getJourneyDistance(journey2.coordinates);
                    journey2.updateDistance(distance).then((journey3) => {
                        io.sockets.emit('journeyDistanceUpdated', { distance: journey3.distance });
                    });
                });
            }
        });
    });

    weatherService.on('weatherForecastUpdated', (forecast) => {
        io.sockets.emit('forecastUpdated', forecast);
    });

    weatherService.on('weatherForecastUpdateFailed', (forecast) => {
        io.sockets.emit('forecastUpdatedFailed', forecast);
    });
};
