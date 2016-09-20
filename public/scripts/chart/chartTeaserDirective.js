'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location, $timeout, chartService, $rootScope) {

    return {
        restrict: "E",
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function (scope, elem, attr) {
        },
        scope: {
            displayZoom: '&'
        },
        controller: function ($scope, $http, geoLocationService, socket) {
            chartService.initialize(document.getElementsByClassName('chart-map')[0]);

            var updateMap = function (coordinates) {
                chartService.mapPanTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
                chartService.setPositionMarker(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
            };

            if ($scope.coordinates) {
                updateMap($scope.coordinates);
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
        }
    }
});