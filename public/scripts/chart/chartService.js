'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function (socket, $rootScope) {
    var map, marker;
    var linePath;
    var journeyMode = false;

    this.resetMap = function () {
        map = undefined;
        marker = undefined;
    };

    this.mapPanTo = function (htmlElement, latlong) {
        var currentMap = getMap(htmlElement);
        currentMap.panTo(latlong);
    };

    this.setPositionMarker = function (latlong) {
        if (journeyMode) {
            addPointToLinepath(latlong);
        } else {
            if (!marker && map) {
                marker = new eniro.maps.Marker({
                    map: map,
                    position: new eniro.maps.LatLng(0, 0) //WAT?
                });
            } else if (!marker) {
                new Error("Map doesn't exist");
            }
            marker.setPosition(latlong);
        }
    };

    var addPointToLinepath = function (latlong) {
        linePath.push(latlong);
    };

    var getMap = function (htmlElement) {
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

    socket.on('coordinatesUpdates', function (data) {
        $rootScope.coordinates = data.coordinates;
    });

    $rootScope.$on('journeyCreated', function (event, data) {
        journeyMode = true;
        marker.setVisible(false);
        linePath = new eniro.maps.MapArray([new eniro.maps.LatLng(data.startPosition.lat, data.startPosition.long)]);
        var line = new eniro.maps.Polyline({
            map: getMap(),
            path: linePath
        });
    });
});