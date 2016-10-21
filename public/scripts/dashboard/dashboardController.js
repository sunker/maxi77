angular.module('HomeCtrl', []).controller('DashboardController', function ($scope, geoService, $location, chartService) {

	$scope.$on('mapInitialized', function () {
		chartService.onClick(function (e) {
			$location.url('/chart');
		});
	});

	$scope.speed = geoService.getCurrentSpeed().toFixed(2);

	$scope.click = function (url) {
		$location.url(url);
	}
});