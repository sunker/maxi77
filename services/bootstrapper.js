var GeoService = require("./geoService");
module.exports = function () {
    var geoService = GeoService.getInstance();

    if (process.argv.slice(2)[0] === "test") {
        setInterval(function () {
            geoService.getNextCoordinateFromTestData();
        }, 1500);
    } else {
        geoService.startGPSDListener(updateGPSCoordinates);
    }


};