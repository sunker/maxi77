var WeatherService = require('../services/weatherService'),
  mongoose = require('mongoose'),
  Journey = mongoose.model('trip');

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    var weahterService = WeatherService.getInstance();

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('getWeatherForecast', function (coordinate) {
      weahterService.getForecasts(coordinate).then(function (forecasts) {
        io.sockets.emit('forecastUpdated', forecasts);
      }, function (error) {
        io.sockets.emit('forecastUpdatedFailed', error);
      });
    });

    socket.on('createJourney', function (coordinates) {
      Journey.create(coordinates.coordinates).then(function (data) {
        io.sockets.emit('journeyCreated', data);
      });
    });

    socket.on('journeyCoordinatesUpdated', function (newCoordinate) {
      Journey.getCurrentJourney().then(function (data) {
        if (data) {
          newCoordinate.isMob = false;
          data.addCoordinate(newCoordinate);
        }
      });
    });

    socket.on('manOverBoard', function (newCoordinate) {
      Journey.getCurrentJourney().then(function (journey) {
        if (journey) {
          socket.broadcast.emit('manOverBoard', newCoordinate);
          newCoordinate.isMob = true;
          journey.addCoordinate(newCoordinate);
        }
      });
    });

    socket.on('journeyZoomLevelChanged', function (zoomLevel) {
      Journey.getCurrentJourney().then(function (journey) {
        if (journey) {
          journey.updateZoomLevel(zoomLevel);
        }
      });
    });

    socket.on('getCurrentJourney', function () {
      Journey.getCurrentJourney().then(function (data) {
        socket.emit('currentJourneyLoaded', {
          journey: data
        });
      });
    });

    socket.on('stopJourney', function (journey) {
      Journey.getById(journey.id).then(function (journeyModel) {
        journeyModel.stop().then(function (data) {
          io.sockets.emit('journeyStopped', data);
        });
      });
    });
  });
};