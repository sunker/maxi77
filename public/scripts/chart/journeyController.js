'use strict';
var chartModule = angular.module('chartModule');
chartModule.controller('journeyController', function ($scope, chartService, socket, geoService) {
    $scope.displayZoom = false;
    $scope.distanceSeamiles = '-';
    var currentCoordinate;

    $scope.loadingJourney = true;

    $scope.$on('mapInitialized', function () {
        chartService.onClick(function (e) {
            chartService.setAutoFocus(false);
        });

        chartService.onZoomChange(function (e) {
            socket.emit('journeyZoomLevelChanged', e.zoomLevel);
        });
    });

    socket.emit('getCurrentJourney');

    $scope.createJourney = function () {
        socket.emit('createJourney', { coordinates: currentCoordinate });
        $scope.loadingJourney = true;
        $scope.distanceSeamiles = 0;
    };

    $scope.stopJourney = function () {
        socket.emit('stopJourney', { id: $scope.journey._id });
        $scope.journey = undefined;
    };

    socket.on('currentJourneyLoaded', function (data) {
        $scope.journey = data.journey;
        $scope.loadingJourney = false;
        if (data.journey) {
            $scope.distanceSeamiles = geoService.metersToSeaMiles(data.journey.distance).toFixed(2);
        }
    });

    socket.on('journeyStopped', function (data) {
        $scope.journey = null;
        $scope.distanceSeamiles = '-';
    });

    socket.on('journeyCreated', function (data) {
        $scope.journey = data;
        $scope.loadingJourney = false;
        $scope.distanceSeamiles = 0;
    });

    socket.on('journeyDistanceUpdated', function (data) {
        $scope.distanceSeamiles = geoService.metersToSeaMiles(data.distance).toFixed(2);
    });

    socket.on('coordinatesUpdated', function (data) {
        $scope.coordinates = geoService.formatCoordinate(data.coordinates);
        currentCoordinate = data.coordinates;
        $scope.speed = geoService.getCurrentSpeed().toFixed(2);
        $scope.bearing = geoService.getBearing().toFixed(0) + '°';
        $scope.compassDirection = geoService.getCompassDirection();
    });
}); 