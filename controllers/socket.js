var weatherService = require("../services/weatherService");
var journeyRepository = require("../services/journeyRepository");
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
  
  var updateGPSCoordinates = function (coords) {
    console.log(socket);
    socket.emit('coordinatesUpdated', { coordinates: coords });    
    console.log(coords);
    journeyRepository.getCurrentJourney().then(function (data) {
      if (data) {
        coords.isMob = false;
        journeyRepository.addCoordinate(data._id, coords)
      }
    });
  };

  //Load on connect
  var coordinate = geoService.getCurrentCoordinate();
  if(coordinate !== null){
    console.log("Sending currentcoord");
    socket.emit('coordinatesUpdated', { coordinates: coordinate });
  };
  updateWeatherForecasts();
  geoService.startListener(updateGPSCoordinates);

  //Shieldings
  setInterval(function () {
    updateWeatherForecasts();
  }, 30000);

  // setInterval(function () {
  //   updateGPSCoordinates();
  // }, 1500);




  //Client events
  socket.on('getWeatherForecast', function (coordinates) {
    updateWeatherForecasts();
  });

  socket.on('createJourney', function (coordinates) {
    journeyRepository.createJourney(coordinates.coordinates).then(function (data) {
      socket.emit('journeyCreated', data);
    });
  });

  socket.on('journeyCoordinatesUpdated', function (newCoordinate) {
    journeyRepository.getCurrentJourney().then(function (data) {
      if (data) {
        newCoordinate.isMob = false;
        journeyRepository.addCoordinate(data._id, newCoordinate)
      }
    });
  });

  socket.on('manOverBoard', function (newCoordinate) {
    journeyRepository.getCurrentJourney().then(function (data) {
      if (data) {
        newCoordinate.isMob = true;
        journeyRepository.addCoordinate(data._id, newCoordinate)
      }
    });
  });

  socket.on('journeyDistanceUpdated', function (meters) {
    journeyRepository.getCurrentJourney().then(function (data) {
      if (data) {
        journeyRepository.updateDistance(data._id, meters)
      }
    });
  });

  socket.on('journeyZoomLevelChanged', function (zoomLevel) {
    journeyRepository.getCurrentJourney().then(function (data) {
      if (data) {
        journeyRepository.updateZoomLevel(data._id, zoomLevel)
      }
    });
  });

  socket.on('getCurrentJourney', function () {
    journeyRepository.getCurrentJourney().then(function (data) {
      socket.emit('currentJourneyLoaded', { journey: data });
    });
  });

  socket.on('stopJourney', function (journey) {
    journeyRepository.stopJourney(journey.id).then(function (data) {
      socket.emit('journeyStopped', data);
    });
  });
};
