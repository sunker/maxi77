angular.module('HomeCtrl', []).controller('DashboardController', function($scope, geoService, $location) {

	$scope.speed = geoService.getCurrentSpeed().toFixed(2);

	$scope.click = function(url){
		$location.url(url);
	}
}); 