angular.module('HomeCtrl', []).controller('DashboardController', function($scope, geoService) {

	// $rootScope.dayText = new Date().toSwedishDay();	
	$scope.speed = geoService.getCurrentSpeed().toFixed(2);
}); 