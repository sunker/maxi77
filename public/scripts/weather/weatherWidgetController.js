var weatherModule = angular.module('weatherModule');
weatherModule.controller('weatherWidgetController', function ($scope, geoService, weatherService, socket) {
	var coord = geoService.getCurrentCoordinate();
	socket.emit('getWeatherForecast', coord.lat === 0 && coord.lng === 0 ? null : coord);
	$scope.errorMessage = null;

	socket.on('forecastUpdated', function (data) {
		$scope.errorMessage = undefined;
		refresh(weatherService.getCurrentForecastFromForecasts(data));
	});

	socket.on('forecastUpdatedFailed', function () {
		$scope.errorMessage = false;
	});

	var refresh = function (data) {
		$scope.errorMessage = undefined;
		$scope.imageUrl = data.swedishWeatherType.value;
		$scope.weatherDescription = weatherService.convertWeatherTypeToText(data.swedishWeatherType.value);
		$scope.time = 'kl. ' + new Date(data.validTime).getHours();
		$scope.temperature = data.temperature.value + '°';
		$scope.windSpeed = data.windVelocity.value + ' (' + data.windGust.value + ') m/s ' + weatherService.convertWindDirectionToText(data.windDirection.value);
	};
});