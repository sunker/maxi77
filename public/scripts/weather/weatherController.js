'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.controller('WeatherController', function ($scope, weatherService) {
    geoLocationService.getCurrentPosition().then(function (res) {
        weatherService.getWeatherForecasts(res.coords.longitude, res.coords.latitude).then(
            function (res) {
                $scope.forecasts = res;
            },
            function (error) {
                $scope.errorMessage = "Kan inte ansluta till SMHI";
            });
    });
});