'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.controller('weatherTeaserController', function ($scope, geoLocationService, weatherService, socket) {

	socket.on('forecastUpdated', function (data) {
		$scope.errorMessage = undefined;
		refresh(weatherService.getCurrentForecastFromForecasts(data));
	});

	socket.on('forecastUpdatedFailed', function (data) {
		$scope.errorMessage = "Kan inte ansluta till SMHI";
	});

	var refresh = function(data) {
		$scope.errorMessage = undefined;
		$scope.imageUrl = data.swedishWeatherType.value;
		$scope.weatherDescription = data.swedishWeatherType.text;
		$scope.time = "kl " + new Date().getSeconds();//new Date(data.validTime).getHours();
		$scope.temperature = data.temperature.value + "°";
		$scope.windSpeed = data.windVelocity.value + " m/s " + data.windDirection.text + " (" + data.windGust.value + " m/s byvind)";
	};
	
});


		