'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location, $timeout, chartService, $rootScope) {

    var updateMap = function (coordinates) {
        var mapDiv = document.getElementsByClassName('chart-map')[0];
        chartService.mapPanTo(mapDiv, new eniro.maps.LatLng(coordinates.lat, coordinates.long))
        chartService.setPositionMarker(new eniro.maps.LatLng(coordinates.lat, coordinates.long))
    };

    return {
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function (scope, elem, attr) {
        },
        controller: function ($scope, $http, geoLocationService, socket) {
            chartService.initialize(document.getElementsByClassName('chart-map')[0]);

            if ($scope.coordinates) {
                updateMap($scope.coordinates);
            };

            $scope.$watch('coordinates', function (value) {
                if (value) updateMap(value);
            });

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
            });
        }
    }
});