'use strict';
var weatherModule = angular.module('weatherModule');
weatherModule.controller('WeatherController', function ($scope, weatherService, socket, geoService) {
    var coord = geoService.getCurrentCoordinate();
    socket.emit('getWeatherForecast', coord.lat === 0 && coord.lng === 0 ? null : coord);
    $scope.errorMessage = null;

    socket.on('forecastUpdated', function (data) {
        $scope.errorMessage = undefined;
        var forecasts = weatherService.getUpcomingForecastByForecasts(data);
        var temp = [];
        for (var i = 0; i < forecasts.length; i++) {
            temp.push(userFriendlifyForecast(forecasts[i]));
        }
        $scope.forecasts = temp;
    });

    socket.on('forecastUpdatedFailed', function (data) {
        $scope.errorMessage = 'Kan inte ansluta till SMHI';
    });

    var userFriendlifyForecast = function (forecast) {
        return {
            imageUrl: forecast.swedishWeatherType.value,
            weatherDescription: weatherService.convertWeatherTypeToText(forecast.swedishWeatherType.value),
            time: weatherService.getTime(new Date(forecast.validTime)), //"kl. " + new Date(forecast.validTime).getHours()
            temperature: forecast.temperature.value + '°',
            windSpeed: forecast.windVelocity.value + ' (' + forecast.windGust.value + ') m/s ' + weatherService.convertWindDirectionToText(forecast.windDirection.value),
            humidity: forecast.relativeHumidity.value + '%',
            precipitation: weatherService.getPrecipitation(forecast),
            seanLevel: forecast.meanSeanLevel.value + 'hPA',
            visibility: forecast.visibility.value + ' km',
            thunderstormProbability: (forecast.thunderstormProbability.value ? forecast.thunderstormProbability.value : forecast.thunderstormProbability.values[0]) + '%'
        };
    };
});