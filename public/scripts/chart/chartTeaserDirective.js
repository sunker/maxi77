'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location, $timeout) {

    var map, mark;
    var updateMap = function (coordinates) {
        var mapDiv = document.getElementsByClassName('chart-map')[0];
        if (!map) {
            map = new eniro.maps.Map(mapDiv, {
                center: new eniro.maps.LatLng(coordinates.lat, coordinates.long),
                zoom: 8,
                mapTypeId: eniro.maps.MapTypeId.NAUTICAL,
                mapTypeControl: false,
                zoomControl: false,
                focus: true
            });
        } else {
            map.panTo(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
        }

        if (!mark) {
            mark = new eniro.maps.Marker({
                position: new eniro.maps.LatLng(coordinates.lat, coordinates.long),
                map: map
            });
        } else {
            mark.setPosition(new eniro.maps.LatLng(coordinates.lat, coordinates.long));
            map.setFocus(true);
        }
    };

    return {
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function (scope, elem, attr) {
            scope.$watch('coordinates', function (value) {
                $timeout(function () {
                    updateMap(value);
                });
            });
        },
        controller: function ($scope, $http, geoLocationService, socket) {

            socket.on('coordinatesUpdates', function (data) {
                $scope.coordinates = data.coordinates;
            });
        }
    }
});