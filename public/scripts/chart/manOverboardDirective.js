'use strict';
var chartModule = angular.module('chartModule');
chartModule.directive('manOverboard', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/chart/manOverboardTemplate.html',
        link: function () {
        },
        scope: {            
        },
        controller: function($scope, chartService, geoService, socket){
            $scope.manOverBoard = function () {
                var coordinate = geoService.getCurrentCoordinate();
                chartService.addRedMarker(coordinate);
                socket.emit('manOverBoard', coordinate);
            };
        }   
    };

});