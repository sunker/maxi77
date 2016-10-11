'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.controller('weatherWidgetController', function ($scope, geoLocationService, weatherService, socket) {
	socket.emit('getWeatherForecast');

	socket.on('forecastUpdated', function (data) {
		console.log("forecastUpdated");
		$scope.errorMessage = undefined;
		refresh(weatherService.getCurrentForecastFromForecasts(data));
	});

	socket.on('forecastUpdatedFailed', function (data) {
		$scope.errorMessage = "Kan inte ansluta till SMHI";
	});

	var refresh = function (data) {
		$scope.errorMessage = undefined;
		$scope.imageUrl = data.swedishWeatherType.value;
		$scope.weatherDescription = weatherService.convertWeatherTypeToText(data.swedishWeatherType.value);
		$scope.time = "kl. " + new Date(data.validTime).getHours();
		$scope.temperature = data.temperature.value + "°";
		$scope.windSpeed = data.windVelocity.value + " (" + data.windGust.value + ") m/s " + weatherService.convertWindDirectionToText(data.windDirection.value);
	};
});


