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

	$locationProvider.html5Mode(true);

}]);