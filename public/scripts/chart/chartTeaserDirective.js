'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location, $timeout, chartService) {

    var map, mark;
    var updateMap = function (coordinates) {
        var mapDiv = document.getElementsByClassName('chart-map')[0];
        var map = chartService.getMap(mapDiv);
        map.panTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));

        var marker = chartService.getPositionMarker();
        marker.setPosition(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
    };

    return {
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function (scope, elem, attr) {

            // elem.bind("click", function () {
            //     $location.url('/chart');
            // });
        },
        controller: function ($scope, $http, geoLocationService, socket) {

            if ($scope.coordinates) {
                chartService.resetMap();
                updateMap($scope.coordinates);
            };

            $scope.$watch('coordinates', function (value) {
                if (value) updateMap(value);
            });
        }
    }
});