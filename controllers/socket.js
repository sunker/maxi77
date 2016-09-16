var weatherService = require("../services/weatherService");
var journeyService = require("../services/journeyService");
var geoService = require("../services/geoService");

module.exports = function (socket) {

  var updateWeatherForecasts = function () {
    var updateWeatherAttempts = 0;

    weatherService.getForecasts().then(
      function (result) {
        updateForecasts = 0;
        socket.emit('forecastUpdated', result);

      },
      function (error) {
        updateWeatherAttempts++;
        if (updateWeatherAttempts > 0) {
          socket.emit('forecastUpdatedFailed', result);
        }
      }
    )
  };

  var updateGPSCoordinates = function () {
    geoService.getCoordinates().then(function (coords) {
      socket.emit('coordinatesUpdates', { coordinates: coords });
    });
  };

  //Load on connect
  updateWeatherForecasts();
  updateGPSCoordinates();

  //Shieldings
  setInterval(function () {
    updateWeatherForecasts();
  }, 30000);

  setInterval(function () {
    updateGPSCoordinates();
  }, 1500);


  //Client events
  socket.on('createJourney', function (coordinates) {
    journeyService.createJourney(coordinates.coordinates).then(function (data) {
      socket.emit('journeyCreated', data);
    });
  });

  socket.on('getCurrentJourney', function () {
    journeyService.getCurrentJourney().then(function (data) {
      socket.emit('currentJourneyLoaded', { journey: data });
    });
  });

  socket.on('stopJourney', function (journey) {
    journeyService.stopJourney(journey.id).then(function (data) {
      socket.emit('journeyStopped', data);  
    });
  });
};
