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
		var text = "";
		switch (value) {
			case 1:
				text = "klart";
			case 2:
				text = "mestadels klart";
			case 3:
				text = "växlande molnighet";
			case 4:
				text = "halvklart";
			case 5:
				text = "molnigt";
			case 6:
				text = "mulet";
			case 7:
				text = "dimma";
			case 8:
				text = "regnskurar";
			case 9:
				text = "åskskurar";
			case 10:
				text = "byar av snöblandat regn";
			case 11:
				text = "snöbyar";
			case 12:
				text = "regn";
			case 13:
				text = "åska";
			case 14:
				text = "snöblandat regn";
			case 15:
				text = "snöfall";		
		}

		return text;
	};

});


