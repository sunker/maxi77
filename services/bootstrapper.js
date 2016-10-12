var GeoService = require("./geoService");
var WeatherService = require("./weatherService");
module.exports = function (testMode) {
    var geoService = GeoService.getInstance();
    var weatherService = WeatherService.getInstance();

    if (!testMode) {
        geoService.startGPSDListener();
    } else {
        setInterval(function () {
            geoService.getNextCoordinateFromTestData();
        }, 1500);
    }

    geoService.once('gpsChanged', function (coordinate) {
        weatherService.startPollingForForecasts(coordinate, testMode);
    });

};