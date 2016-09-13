'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('chartController', function ($scope, chartService, journeyService) {
    
    $scope.journey = journeyService.getJourney();
    
    $scope.createJourney = function() {
        $scope.journey = journeyService.createJourney();
    };

    $scope.zoomIn = function() {
        chartService.zoomIn();
    };

    $scope.zoomOut = function() {
        chartService.zoomOut();
    };
}); 