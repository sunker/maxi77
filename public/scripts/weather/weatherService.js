'use strict';

var weatherModule = angular.module("weatherModule");

weatherModule.service('weatherService', function (backendCaller, $q) {
    var baseUrl = 'weather/'

    this.getWeatherForecast = function (long, lat) {
        var deferred = $q.defer();
        getForecasts(long, lat).then(function (response) {
            var nextHour = response[0];

            for (var i = 0; i < response.length; i++) {
                if (new Date().getHours() === new Date(response[i].validTime).getHours()) {
                    return deferred.resolve(response[i]);
                }
            }

            return deferred.resolve(nextHour);
        },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var getForecasts = function (long, lat) {
        return backendCaller.sendGet(baseUrl + 'getforecasts', { lat: lat, long: long });
    };

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(res) {
        return $q.reject(res.data);
    }
});