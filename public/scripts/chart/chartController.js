'use strict';
var chartModule = angular.module("chartModule");
chartModule.controller('chartController', function ($scope, socket, chartService) {
    var autoFocus = true;
    var coordinates;

    $scope.mapStyle = {
        "height": $scope.mapHeight + "px"
    }

    chartService.initialize(document.getElementsByClassName('chart-map')[0]);

    var updateMap = function (coordinates) {

        if (autoFocus) {
            chartService.mapPanTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
        }
        chartService.setPositionMarker(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
    };

    $scope.click = function ($event) {
        autoFocus = false;
    };

    $scope.panToCenter = function ($event) {
        $event.stopPropagation();
        chartService.mapPanTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
        autoFocus = true;
    };

    $scope.zoomIn = function ($event) {
        $event.stopPropagation();
        chartService.zoomIn();
    };

    $scope.zoomOut = function ($event) {
        $event.stopPropagation();
        chartService.zoomOut();
    };

    socket.on('journeyStopped', function (data) {
        chartService.stopJourney();
    });

    socket.on('journeyCreated', function (data) {
        chartService.loadJourney(data);
    });

    socket.on('currentJourneyLoaded', function (data) {
        if (data.journey) {
            chartService.loadJourney(data.journey);
        } else {
            chartService.stopJourney();
        }
    });

    socket.on('coordinatesUpdates', function (data) {
        coordinates = data.coordinates;
        updateMap(data.coordinates);
        socket.emit('journeyUpdated', data.coordinates);
        // if (data.coordinates) {
        //     updateMap(data.coordinates);
        //     socket.emit('journeyUpdated', data.coordinates);
        // }
    });
}); 