'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('chartController', function ($scope, chartService, journeyService, socket) {
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
        if ($scope.journey && $scope.journey.coordinates.length > 1) {
            var a = geolib.getDistance(
                { latitude: $scope.journey.coordinates[1].latitude, longitude: $scope.journey.coordinates[1].longitude },
                { latitude: $scope.journey.coordinates[0].latitude, longitude: $scope.journey.coordinates[0].longitude }
            );
        }
    });
}); 