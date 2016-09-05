'use strict';

var weatherModule = angular.module("weatherModule");

weatherModule.service('weatherService', function (backendCaller, $q) {
    var baseUrl = 'weather/'

    this.getWeatherForecast = function (long, lat) {
        var defer = $q.defer();
        backendCaller.sendGet(baseUrl + 'getcurrentforecast', { lat: lat, long: long }).then(
            function (response) {
                return defer.resolve(response);
            },
            function(error){
                return defer.reject("weather service down");
            }   
        );
        return defer.promise;
    };

    this.getWeatherForecasts = function (long, lat) {
        var defer = $q.defer();
        backendCaller.sendGet(baseUrl + 'getforecasts', { lat: lat, long: long }).then(
            function (response) {
                return defer.resolve(response);
            },
            function(error){
                return defer.reject("weather service down");
            }   
        );
        return defer.promise;
    };

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(res) {
        return $q.reject(res.data);
    }
});