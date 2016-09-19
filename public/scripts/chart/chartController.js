'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('chartController', function ($scope, chartService, journeyService, socket) {
      
    
    $scope.loadingJourney = true;
    socket.emit('getCurrentJourney');

    $scope.createJourney = function () {
        // journeyService.createJourney();
        socket.emit('createJourney', { coordinates: $scope.coordinates });
        $scope.loadingJourney = true;
    };

    $scope.stopJourney = function () {
        socket.emit('stopJourney', { id: $scope.journey._id });
    };

    $scope.zoomIn = function () {
        chartService.zoomIn();
    };

    $scope.zoomOut = function () {
        chartService.zoomOut();
    };

    socket.on('currentJourneyLoaded', function (data) {
        $scope.journey = data.journey;
        $scope.loadingJourney = false;
    });

    socket.on('journeyStopped', function (data) {
        $scope.journey = null;
    });

    socket.on('journeyCreated', function (data) {
        $scope.journey = data;
        $scope.loadingJourney = false;
    });
}); 