'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function (socket, $rootScope) {

    socket.on('coordinatesUpdates', function (data) {
        $rootScope.coordinates = data.coordinates;
    });

    var map, marker;

    this.resetMap = function () {
        map = undefined;
        marker = undefined;
    };

    this.getMap = function (htmlElement) {
        if (!map) {
            map = new eniro.maps.Map(htmlElement, {
                zoom: 9,
                mapTypeId: eniro.maps.MapTypeId.NAUTICAL,
                mapTypeControl: false,
                zoomControl: false,
                focus: true
            });
        }

        return map;
    };

    this.getPositionMarker = function () {
        if (!marker && map) {
            marker = new eniro.maps.Marker({
                map: map,
                position: new eniro.maps.LatLng(0, 0) //WAT?
            });
            return marker;
        } else if (marker && map) {
            return marker;
        }
        new Error("Map doesn't exist");
    };
});