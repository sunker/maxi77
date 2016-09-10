'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.directive('weatherTeaser', function ($location) {
	
	return {
		templateUrl: 'scripts/weather/weatherTeaserTemplate.html',
		link: function (scope, elem, attr) {
			elem.bind("click", function () {
			    $location.url('/weather');
			});
		},
		controller: 'weatherTeaserController',
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