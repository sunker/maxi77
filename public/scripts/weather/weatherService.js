'use strict';

var weatherModule = angular.module("weatherModule");

weatherModule.service('weatherService', function (backendCaller, $q) {
    var baseUrl = 'weather/';
	
	
	this.getForecasts = function (long, lat) {
        return backendCaller.sendGet(baseUrl + 'getforecasts', { lat: lat, long: long });
	};

    this.getCurrentForecast = function (long, lat) {
        var deferred = $q.defer();
        this.getForecasts(long, lat).then(function (response) {
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

    this.getCurrentForecastFromForecasts = function (forecasts) {        
        var nextHour = forecasts[0];

        for (var i = 0; i < forecasts.length; i++) {
            if (new Date().getHours() === new Date(forecasts[i].validTime).getHours()) {
                return forecasts[i];
            }
        }

        return nextHour;       
    };
});