var SMHI = require("smhi-node");
var Q = require('q');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var instance;

var WeatherService = function () {
    var self = this;

    this.startPollingForForecasts = function (coordinate) {
        updateAndEmit(coordinate);
        setInterval(function () {
            updateAndEmit(coordinate);
        }, 15000);
    };

    this.getForecasts = function (coordinate) {
        var deferred = Q.defer();
        if (coordinate === null) {
            coordinate = { lat: 59, lng: 18 }; // Sthml coordinate
        }
        SMHI.getForecastForLatAndLong(coordinate.lat.toFixed(6), coordinate.lng.toFixed(6)).then(
            function (response) {
                var forecasts = response.getForecasts();
                var result = [forecasts.length];

                for (i = 0; i < forecasts.length; i++) {
                    result[i] = buildJson(forecasts[i]);
                }

                return deferred.resolve(result);
            },
            function (error) {
                // deferred.reject("Weather service down");
                //While developing...use cached forecasts when SMHI/internet is down
                var data = JSON.parse(fs.readFileSync('./SMHITestData.json', 'utf8').toString());

                return deferred.resolve(data);
            }
        );

        return deferred.promise;
    };

    var updateAndEmit = function (coordinate) {
        self.getForecasts(coordinate).then(
            function (success) {
                self.emit('weatherForecastUpdated', success);
            },
            function (fail) {
                //Replace this with error when in production...
                self.emit('weatherForecastUpdated', fail);
                console.log("Could not load SMHI data. Sending cashed data");
                // self.emit('weatherForecastUpdateFailed', fail);
            });
    };

    var forecastsForLatAndLong = function () {
        var deferred = Q.defer();
        //stockholm coordinates
        var lat = 59;
        var long = 18;
        SMHI.getForecastForLatAndLong(lat, long).then(
            function (response) {
                var forecasts = response.getForecasts();
                var result = [forecasts.length];

                for (i = 0; i < forecasts.length; i++) {
                    result[i] = buildJson(forecasts[i]);
                }

                return deferred.resolve(result);
            },
            function (error) {
                // deferred.reject("Weather service down");
                //While developing...use cached forecasts when SMHI/internet is down
                var data = JSON.parse(fs.readFileSync('./SMHITestData.json', 'utf8').toString());

                return deferred.resolve(data);
            }
        );

        return deferred.promise;
    };

    var buildJson = function (forecast) {
        return {
            temperature: forecast.getTemperature(),
            meanSeanLevel: forecast.getMeanSeaLevel(),
            validTime: forecast.getValidTime(),
            lastUpdated: forecast.getReferencetime(),
            visibility: forecast.getVisibility(),
            windDirection: forecast.getWindDirection(),
            windVelocity: forecast.getWindVelocity(),
            windGust: forecast.getGust(),
            relativeHumidity: forecast.getRelativeHumidity(),
            thunderstormProbability: forecast.getThunderstormProbability(),
            maximumPrecipitationIntensity: forecast.getMaximumPrecipitationIntensity(),
            minimumPrecipitationIntensity: forecast.getMinimumPrecipitationIntensity(),
            precipitationType: getSwedishPrecipitationType(forecast.getPrecipitationCategory()),
            swedishWeatherType: forecast.getWeatherSymbol()
        }
    };

    var getSwedishPrecipitationType = function (precipitationCategory) {

        switch (precipitationCategory.values[0]) {
            case 1:
                return "snö";
            case 2:
                return "snöblandat regn";
            case 3:
                return "regn";
            case 4:
                return "duggregn";
            case 5:
                return "underkylt regn";
            case 6:
                return "underkylt duggregn";
            default:
                return null;
        }
    };
};

util.inherits(WeatherService, EventEmitter);

module.exports = {
    getInstance: function () {
        return instance || (instance = new WeatherService())
    }
};