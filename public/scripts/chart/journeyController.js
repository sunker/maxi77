'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('journeyController', function ($scope, chartService, journeyService, socket, geoService) {
    $scope.displayZoom = false;
    $scope.distanceKm = $scope.distanceSeamiles = "-";
    var currentCoordinate;  

    $scope.loadingJourney = true;
    socket.emit('getCurrentJourney');

    $scope.createJourney = function () {
        socket.emit('createJourney', { coordinates: currentCoordinate });
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
            $scope.distanceKm = (data.journey.distance/1000).toFixed(2);
            $scope.distanceSeamiles = geoService.metersToSeaMiles(data.journey.distance).toFixed(2);
        }   
    });

    socket.on('journeyStopped', function (data) {
        $scope.journey = null;
        $scope.distanceKm = $scope.distanceSeamiles = "-";
    });

    socket.on('journeyCreated', function (data) {
        $scope.distanceKm = $scope.distanceSeamiles = 0;
        $scope.journey = data;
        $scope.loadingJourney = false;
    });

    socket.on('coordinatesUpdated', function (data) {
        $scope.coordinates = geoService.formatCoordinate(data.coordinates);
        currentCoordinate = data.coordinates;
        $scope.speed = geoService.getCurrentSpeed().toFixed(2);

        if ($scope.journey) {
            var distanceInMeters = $scope.distance = geoService.getDistanceInMetersBetweenLastTwoCoordinates();
            $scope.distanceKm = (Number($scope.distanceKm) + (distanceInMeters/1000)).toFixed(2);
            $scope.distanceSeamiles = (Number($scope.distanceSeamiles) + geoService.metersToSeaMiles(distanceInMeters)).toFixed(2);
            // socket.emit('journeyCoordinatesUpdated', data.coordinates);
            socket.emit('journeyDistanceUpdated', distanceInMeters);
        }        
    });
}); 