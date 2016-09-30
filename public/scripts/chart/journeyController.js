'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('journeyController', function ($scope, chartService, journeyService, socket, geoService) {
    $scope.displayZoom = false;
    $scope.distanceMeters = 0;
    $scope.distanceSeamiles = 0;

    $scope.loadingJourney = true;
    socket.emit('getCurrentJourney');

    $scope.createJourney = function () {
        socket.emit('createJourney', { coordinates: $scope.coordinates });
        $scope.loadingJourney = true;
    };

    $scope.stopJourney = function () {
        socket.emit('stopJourney', { id: $scope.journey._id });
        $scope.journey = undefined;
    };

    socket.on('currentJourneyLoaded', function (data) {
        $scope.journey = data.journey;
        $scope.loadingJourney = false;
        if (data.journey) {
            $scope.distanceMeters = (data.journey.distance).toFixed(2);
            $scope.distanceSeamiles = geoService.metersToSeaMiles(data.journey.distance).toFixed(2);
        }
    });

    socket.on('journeyStopped', function (data) {
        $scope.journey = null;
        $scope.distanceMeters = $scope.distanceSeamiles = 0;
    });

    socket.on('journeyCreated', function (data) {
        $scope.journey = data;
        $scope.loadingJourney = false;
    });

    socket.on('coordinatesUpdated', function (data) {
        $scope.coordinates = data.coordinates;
        $scope.speed = geoService.getCurrentSpeed(data.coordinates).toFixed(2);

        if ($scope.journey) {
            var distanceInMeters = $scope.distance = geoService.getDistanceInMetersBetweenLastTwoCoordinates();
            $scope.distanceMeters = (Number($scope.distanceMeters) + distanceInMeters).toFixed(2);
            $scope.distanceSeamiles = (Number($scope.distanceSeamiles) + geoService.metersToSeaMiles(distanceInMeters)).toFixed(2);
            socket.emit('journeyCoordinatesUpdate', data.coordinates);
            socket.emit('journeyDistanceUpdated', distanceInMeters);
        }        
    });
}); 