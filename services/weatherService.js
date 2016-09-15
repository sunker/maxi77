// var SMHI = require("smhi-node");
var SMHI = require("smhi-node");
var Q = require('q');

var weatherService = {};

weatherService.getForecasts = function () {
    return forecastsForLatAndLong();
};

var forecastsForLatAndLong = function(){
    var deferred = Q.defer();
    //stockholm coordinates
    var lat = 59;
    var long = 18;
    SMHI.getForecastForLatAndLong(lat, long).then(
       function (response) {
            var forecasts = response.getForecasts();            
            var result = [forecasts.length];

            for (i = 0; i <forecasts.length; i++) { 
                result[i] = buildJson(forecasts[i]);
            }
            
            return deferred.resolve(result);
        },
        function (error) {
            deferred.reject("Weather service down");
        } 
    );

    return deferred.promise;
};

module.exports = weatherService;

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