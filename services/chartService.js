var geoService = require("/geoService");
module.exports = function (io) {

    if (process.argv.slice(2)[0] === "test") {
        setInterval(function () {
            geoService.getNextCoordinateFromTestData().then(function (data) {
                updateGPSCoordinates(data);
            });
        }, 1500);
    } else {
        geoService.startGPSDListener(updateGPSCoordinates);
    }
};