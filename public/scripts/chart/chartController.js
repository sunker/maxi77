var chartModule = angular.module('chartModule');
chartModule.controller('chartController', function ($scope, socket, chartService) {
    var coordinates;
    $scope.initialized = null;

    $scope.mapStyle = {
        'height': $scope.mapHeight + 'px'
    };

    var timer = function () {
        setTimeout(function () {
            initializeMap();
        }, 5000);
    };

    var initializeMap = function () {
        $scope.initialized = chartService.initialize(document.getElementsByClassName('chart-map')[0]);
        if ($scope.initialized) {
            clearTimeout(timer);
        } else {
            timer();
        }
    };

    initializeMap();

    socket.emit('getCurrentJourney');

    var updateMap = function (coordinates) {
        chartService.setPositionMarker(coordinates.lat, coordinates.lng);
    };

    $scope.panToCenter = function ($event) {
        $event.stopPropagation();
        chartService.panTo(coordinates.lat, coordinates.lng);
        chartService.setAutoFocus(true);
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

    socket.on('coordinatesUpdated', function (data) {
        coordinates = data.coordinates;
        updateMap(data.coordinates);
    });

    socket.on('manOverBoard', function (coordinate) {
        chartService.addRedMarker(coordinate);
        chartService.addRedMarker(coordinate);
    });
});