'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location, $timeout, chartService) {

    var map, mark;
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
            chartService.initializeMap(document.getElementsByClassName('chart-map')[0]);

            if ($scope.coordinates) {
                updateMap($scope.coordinates);
            };

            $scope.$watch('coordinates', function (value) {
                if (value) updateMap(value);
            });
        }
    }
});