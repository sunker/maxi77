'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.controller('WeatherController', function ($scope, weatherService, socket) {
    socket.emit('getWeatherForecast');

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
		$scope.errorMessage = "Kan inte ansluta till SMHI";
	});

    var userFriendlifyForecast = function(forecast) {
        return { 
            imageUrl: forecast.swedishWeatherType.value,
            weatherDescription: weatherService.convertWeatherTypeToText(forecast.swedishWeatherType.value),
            time: "kl. " + new Date(forecast.validTime).getHours(),
            temperature: forecast.temperature.value + "°",
            windSpeed: forecast.windVelocity.value + " (" + forecast.windGust.value + ") m/s " + weatherService.convertWindDirectionToText(forecast.windDirection.value)
        };
	};
});