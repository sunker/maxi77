'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('chartTeaserController', function ($scope, $rootScope, socket, chartService) {
    chartService.initialize(document.getElementsByClassName('chart-map')[0]);
    var updateMap = function (coordinates) {
        chartService.mapPanTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
        chartService.setPositionMarker(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
    };

    if ($scope.coordinates) {
        updateMap($scope.coordinates);
    };

    $scope.zoomIn = function () {
        chartService.zoomIn();
    };

    $scope.zoomOut = function () {
        chartService.zoomOut();
    };

    socket.on('journeyStopped', function (data) {
        chartService.stopJourney();
    });

    socket.on('journeyCreated', function (data) {
        chartService.startJourney(data);
    });

    socket.on('currentJourneyLoaded', function (data) {
        if (data.journey) {
            chartService.startJourney(data.journey);
        } else {
            chartService.stopJourney();
        }
    });

    socket.on('coordinatesUpdates', function (data) {
        $rootScope.coordinates = data.coordinates;
        if (data.coordinates) updateMap(data.coordinates);
    });
}); 