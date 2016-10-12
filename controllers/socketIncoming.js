var WeatherService = require("../services/weatherService");
var journeyRepository = require("../services/journeyRepository");
var GeoService = require("../services/geoService");

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    var geoService = GeoService.getInstance();
    var weahterService = WeatherService.getInstance();


    //Load on connect
    // var initialize = function () {
    //   console.log('a user connected');
    //   var coordinate = geoService.getCurrentCoordinate();
    //   if (coordinate !== null) {
    //     console.log("Sending currentcoord");
    //     socket.emit('coordinatesUpdated', { coordinates: coordinate });
    //   };
    // };

    // initialize();

    //Client events
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('getWeatherForecast', function (coordinate) {
      weahterService.getForecasts(coordinate).then(function (forecasts) {
        io.sockets.emit('forecastUpdated', forecast);
      }, function (error) {
        io.sockets.emit('forecastUpdatedFailed', error);
      });
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
          journeyRepository.addCoordinate(data._id, newCoordinate);
        }
      });
    });

    socket.on('manOverBoard', function (newCoordinate) {
      journeyRepository.getCurrentJourney().then(function (data) {
        if (data) {
          socket.broadcast.emit('manOverBoard', newCoordinate);
          newCoordinate.isMob = true;
          journeyRepository.addCoordinate(data._id, newCoordinate)
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
