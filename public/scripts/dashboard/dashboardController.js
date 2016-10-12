angular.module('HomeCtrl', []).controller('DashboardController', function($scope, geoService, $location) {

	// $rootScope.dayText = new Date().toSwedishDay();	
	$scope.speed = geoService.getCurrentSpeed().toFixed(2);

	$scope.click = function(url){
		$location.url(url);
	}
}); 