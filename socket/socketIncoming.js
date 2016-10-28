const WeatherService = require('../services/weatherService'),
  mongoose = require('mongoose'),
  Journey = mongoose.model('trip');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    const weahterService = WeatherService.getInstance();

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('getWeatherForecast', (coordinate) => {
      weahterService.getForecasts(coordinate).then((forecasts) => {
        io.sockets.emit('forecastUpdated', forecasts);
      }, (error) => {
        io.sockets.emit('forecastUpdatedFailed', error);
      });
    });

    socket.on('createJourney', (coordinates) => {
      Journey.create(coordinates.coordinates).then((data) => {
        io.sockets.emit('journeyCreated', data);
      });
    });

    socket.on('journeyCoordinatesUpdated', (newCoordinate) => {
      Journey.getCurrentJourney().then((data) => {
        if (data) {
          newCoordinate.isMob = false;
          data.addCoordinate(newCoordinate);
        }
      });
    });

    socket.on('manOverBoard', (newCoordinate) => {
      Journey.getCurrentJourney().then((journey) => {
        if (journey) {
          socket.broadcast.emit('manOverBoard', newCoordinate);
          newCoordinate.isMob = true;
          journey.addCoordinate(newCoordinate);
        }
      });
    });

    socket.on('journeyZoomLevelChanged', (zoomLevel) => {
      Journey.getCurrentJourney().then((journey) => {
        if (journey) {
          journey.updateZoomLevel(zoomLevel);
        }
      });
    });

    socket.on('getCurrentJourney', () => {
      Journey.getCurrentJourney().then((data) => {
        socket.emit('currentJourneyLoaded', {
          journey: data
        });
      });
    });

    socket.on('stopJourney', (journey) => {
      Journey.getById(journey.id).then((journeyModel) => {
        journeyModel.stop().then((data) => {
          io.sockets.emit('journeyStopped', data);
        });
      });
    });
  });
};