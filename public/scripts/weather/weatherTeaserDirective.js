'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.directive('weatherTeaser', function ($location) {

    return {
        templateUrl: 'scripts/weather/weatherTeaserTemplate.html',
        link: function (scope, elem, attr) {
            elem.bind("click", function () {
                $location.url('/weather')
            });
        },
        controller: function ($scope, geoLocationService, weatherService) {
            geoLocationService.getCurrentPosition().then(function (res) {
                weatherService.getWeatherForecast(res.coords.longitude, res.coords.latitude).then(
                    function (res) {
                        $scope.errorMessage = undefined;
                        $scope.imageUrl = res.swedishWeatherType.value;
                        $scope.weatherDescription = res.swedishWeatherType.text;
                        $scope.time = "kl " + new Date(res.validTime).getHours();
                        $scope.temperature = res.temperature.value + "°";
                        $scope.windSpeed = res.windVelocity.value + " m/s " + res.windDirection.text + " (" + res.windGust.value + " m/s byvind)";
                    },
                    function (error) {
                        $scope.errorMessage = "Kan inte ansluta till SMHI";
                    });
            });
        },
        function(error) {
            $scope.errorMessage = "Kan inte ansluta till SMHI";
        }
    };
});


// lastUpdated
// :
// "2016-09-04T06:00:00.000Z"
// maximumPrecipitationIntensity
// :
// Object
// meanSeanLevel
// :
// Object
// minimumPrecipitationIntensity
// :
// Object
// precipitationType
// :
// null
// relativeHumidity
// :
// Object
// swedishWeatherType
// :
// Object
// temperature
// :
// Object
// thunderstormProbability
// :
// Object
// validTime
// :
// "2016-09-04T07:00:00.000Z"
// visibility
// :
// Object
// windDirection
// :
// Object
// windGust
// :
// Object
// windVelocity
// :
// Object
// __proto__
// :
// Object