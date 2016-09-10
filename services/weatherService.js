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
        windDirection: forecast.getWindDirection().withTextFormat(),
        windVelocity: forecast.getWindVelocity(),
        windGust: forecast.getGust(),
        relativeHumidity: forecast.getRelativeHumidity(),
        thunderstormProbability: forecast.getThunderstormProbability(),
        maximumPrecipitationIntensity: forecast.getMaximumPrecipitationIntensity(),
        minimumPrecipitationIntensity: forecast.getMinimumPrecipitationIntensity(),
        precipitationType: getSwedishPrecipitationType(forecast.getPrecipitationCategory()),
        swedishWeatherType: forecast.getWeatherSymbol().withSwedishText()
    }
};

Object.prototype.withTextFormat = function() {
    var val = Math.floor((this.value / 22.5) + 0.5);
    var arr = ["nordlig", "nord nordöstlig", "nordöst", "öst nordöstlig", "östlig", "öst sydöstlig", "sydöstlig", "syd sydöstlig", "sydlig", "syd sydvästlig", "sydvästlig", "väst sydvästlig", "västligt", "väst nordvästlig", "nordvästlig", "nord nordvästlig"];
    this.text = arr[(val % 16)];
    return this;
};


Object.prototype.withSwedishText = function() {	 
  switch (this.value) {
        case 1:
            this.text = "klart";
            return this;
        case 2:
            this.text =  "mestadels klart";
            return this;
        case 3:
            this.text =  "växlande molnighet";
            return this;
        case 4:
            this.text =  "halvklart";
            return this;
        case 5:
            this.text =  "molnigt";
            return this;
        case 6:
            this.text =  "mulet";
            return this;
        case 7:
            this.text =  "dimma";
            return this;
        case 8:
            this.text =  "regnskurar";
            return this;
        case 9:
            this.text =  "åskskurar";
            return this;
        case 10:
            this.text =  "byar av snöblandat regn";
            return this;
        case 11:
            this.text =  "snöbyar";
            return this;
        case 12:
            this.text =  "regn";
            return this;
        case 13:
            this.text =  "åska";
            return this;
        case 14:
            this.text =  "snöblandat regn";
            return this;
        case 15:
            this.text =  "snöfall";
            return this;
        default:
            this.text =  undefined;
            return this;
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