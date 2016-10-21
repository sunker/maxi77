angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		// home page
		.when('/', {
			templateUrl: 'scripts/dashboard/dashboardTemplate.html',
			controller: 'DashboardController'
		})

		.when('/weather', {
			templateUrl: 'scripts/weather/weatherTemplate.html',
			controller: 'WeatherController'
		})

		.when('/chart', {
			templateUrl: 'scripts/chart/journeyTemplate.html',
			controller: 'journeyController'
		});

	$locationProvider.html5Mode(false);

}]);