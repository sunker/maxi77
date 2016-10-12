'use strict';
var weatherModule = angular.module("weatherModule");
weatherModule.directive('weatherWidget', function ($location) {
	
	return {
		templateUrl: 'scripts/weather/weatherWidgetTemplate.html',
		link: function (scope, elem, attr) {
			elem.bind("click", function () {
			    $location.url('/weather');
			});
		},
		controller: 'weatherWidgetController',
	};
});
