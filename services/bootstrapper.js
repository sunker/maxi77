var GeoService = require("./geoService");
var WeatherService = require("./weatherService");
module.exports = function () {
    var geoService = GeoService.getInstance();
    var weatherService = WeatherService.getInstance();

    if (process.argv.slice(2)[0] === "test") {
        setInterval(function () {
            geoService.getNextCoordinateFromTestData();
        }, 1500);
    } else {
        geoService.startGPSDListener();
    }

    geoService.once('gpsChanged', function (coordinate) {
        weatherService.startPollingForForecasts(coordinate);
    });

};