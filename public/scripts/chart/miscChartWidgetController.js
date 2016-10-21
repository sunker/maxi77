'use strict';
var chartModule = angular.module('chartModule');
chartModule.controller('miscChartWidgetController', function ($scope, socket, geoService) {
    $scope.speed = $scope.compassDirection = '-';
    $scope.coordinates = { lat: '-', lng: '-' };

    socket.on('coordinatesUpdated', function (data) {
        $scope.coordinates = geoService.formatCoordinate(data.coordinates);
        $scope.speed = geoService.getCurrentSpeed().toFixed(2);
        $scope.compassDirection = geoService.getCompassDirection();
    });
});