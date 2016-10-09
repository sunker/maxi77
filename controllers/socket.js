var weatherService = require("../services/weatherService");
var journeyRepository = require("../services/journeyRepository");
var geoService = require("../services/geoService");
var Bancroft = require('bancroft');

module.exports = function (io) {
  io.on('connection', function (socket) {
    
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

    var startGPIOListener = function () {
      var bancroft = new Bancroft();

      bancroft.on('connect', function () {
        console.log('GPIO connected');
      });

      bancroft.on('location', function (location) {
        if (geoService.isRealMovement(location)) {
          updateGPSCoordinates({ lat: location.latitude, lng: location.longitude, timestamp: location.timestamp });
        }
      });

      bancroft.on('satellite', function (satellite) {
      });

      bancroft.on('disconnect', function (err) {
        console.log('GPIO disconnected');
        //If disconnected, for now we consider it being debug mode. so just use looped test data coordinates
        setInterval(function () {
          geoService.getNextCoordinateFromTestData().then(function (data) {
            updateGPSCoordinates(data);
          });
        }, 1500);
      });
    };

    var updateGPSCoordinates = function (coords) {
      io.sockets.emit('coordinatesUpdated', { coordinates: coords });
      console.log(coords);
      journeyRepository.getCurrentJourney().then(function (data) {
        if (data) {
          coords.isMob = false;
          journeyRepository.addCoordinate(data._id, coords)
        }
      });
    };

    //Load on connect
    var initialize = function () {
      console.log('a user connected');
      var coordinate = geoService.getCurrentCoordinate();
      if (coordinate !== null) {
        console.log("Sending currentcoord");
        socket.emit('coordinatesUpdated', { coordinates: coordinate });
      };
      updateWeatherForecasts();
      // geoService.startListener(updateGPSCoordinates, socket);
      startGPIOListener(updateGPSCoordinates);
    };

    initialize();

    //Shieldings
    setInterval(function () {
      updateWeatherForecasts();
    }, 30000);

    //Client events
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('getWeatherForecast', function (coordinates) {
      updateWeatherForecasts();
    });

    socket.on('createJourney', function (coordinates) {
      journeyRepository.createJourney(coordinates.coordinates).then(function (data) {
        io.sockets.emit('journeyCreated', data);
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
        io.sockets.emit('journeyStopped', data);
      });
    });
  });
};
