'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.controller('weatherWidgetController', function ($scope, geoLocationService, weatherService, socket) {
	socket.emit('getWeatherForecast');

	socket.on('forecastUpdated', function (data) {
		$scope.errorMessage = undefined;
		refresh(weatherService.getCurrentForecastFromForecasts(data));
	});

	socket.on('forecastUpdatedFailed', function (data) {
		$scope.errorMessage = "Kan inte ansluta till SMHI";
	});

	var refresh = function (data) {
		$scope.errorMessage = undefined;
		$scope.imageUrl = data.swedishWeatherType.value;
		$scope.weatherDescription = convertWeatherTypeToText(data.swedishWeatherType.value);
		$scope.time = "kl " + new Date(data.validTime).getHours();
		$scope.temperature = data.temperature.value + "°";
		$scope.windSpeed = data.windVelocity.value + " m/s " + convertWindDirectionToText(data.windDirection) + " (" + data.windGust.value + " m/s byvind)";
	};

	//Move to service?
	var convertWindDirectionToText = function (windDirection) {
		var val = Math.floor((windDirection / 22.5) + 0.5);
		var arr = ["nordlig", "nord nordöstlig", "nordöst", "öst nordöstlig", "östlig", "öst sydöstlig", "sydöstlig", "syd sydöstlig", "sydlig", "syd sydvästlig", "sydvästlig", "väst sydvästlig", "västligt", "väst nordvästlig", "nordvästlig", "nord nordvästlig"];
		return arr[(val % 16)];
	};

	var convertWeatherTypeToText = function (value) {

		switch (value) {
			case 1:
				return "klart";
			case 2:
				return "mestadels klart";
			case 3:
				return "växlande molnighet";
			case 4:
				return "halvklart";
			case 5:
				return "molnigt";
			case 6:
				return "mulet";
			case 7:
				return "dimma";
			case 8:
				return "regnskurar";
			case 9:
				return "åskskurar";
			case 10:
				return "byar av snöblandat regn";
			case 11:
				return "snöbyar";
			case 12:
				return "regn";
			case 13:
				return "åska";
			case 14:
				return "snöblandat regn";
			case 15:
				return "snöfall";
			default:
				return "";
		}
	};

});


