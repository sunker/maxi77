angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		// home page
		.when('/', {
			templateUrl: 'scripts/home/homeTemplate.html',
			controller: 'HomeController'
		})

		.when('/weather', {
			templateUrl: 'scripta/weather/weatherTemplate.html',
			controller: 'WeatherController'
		})

		.when('/chart', {
			templateUrl: 'scripta/chart/chartTemplate.html',
			controller: 'chartController'
		})

	$locationProvider.html5Mode(true);

}]);