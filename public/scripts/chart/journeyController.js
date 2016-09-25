'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('journeyController', function ($scope, chartService, journeyService, socket, geoService) {
    $scope.displayZoom = false;

    $scope.loadingJourney = true;
    socket.emit('getCurrentJourney');

    $scope.createJourney = function () {
        socket.emit('createJourney', { coordinates: $scope.coordinates });
        $scope.loadingJourney = true;
    };

    $scope.stopJourney = function () {
        socket.emit('stopJourney', { id: $scope.journey._id });
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

    socket.on('coordinatesUpdates', function (data) {
        $scope.coordinates = data.coordinates;
        var a = geoService.getCurrentSpeed(data.coordinates);
        // console.log(a);
    });
}); 