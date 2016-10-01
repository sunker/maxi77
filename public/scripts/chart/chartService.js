'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function () {
    var map, marker, line;
    var linePath;
    var journeyMode = false;

    this.initialize = function (parentDiv) {
        try {
            map = new eniro.maps.Map(parentDiv, {
                zoom: 10,
                mapTypeId: eniro.maps.MapTypeId.NAUTICAL,
                mapTypeControl: false,
                zoomControl: false,
                focus: true
            });

            if (journeyMode) {
                line = new eniro.maps.Polyline({
                    map: map,
                    path: linePath
                });
            } else {
                marker = new eniro.maps.Marker({
                    map: map,
                    position: new eniro.maps.LatLng(0, 0) //WAT?
                });
            }
            return true;
        } catch(ex) {
            return false;
        }
    };

    this.mapPanTo = function (latlong) {
        map.panTo(latlong);
    };

    this.setPositionMarker = function (latlong) {
        if (journeyMode) {
            linePath.push(latlong);
        } else {
            marker.setPosition(latlong);
        }
    };

    this.zoomIn = function () {
        var zoomLevel = map.getZoom();
        map.setZoom(--zoomLevel);
        return map.getZoom();
    };

    this.zoomOut = function () {
        var zoomLevel = map.getZoom();
        map.setZoom(++zoomLevel);
        return map.getZoom();
    };

    this.stopJourney = function () {
        journeyMode = false;
        if (marker) {
            marker.setVisible(true);
            marker.setMap(map);
        };

        if (line) line.setMap(null);
        if (linePath) linePath = [];
    };

    this.loadJourney = function (data) {
        journeyMode = true;
        marker.setVisible(false);
        map.setZoom(data.zoom_level);
        linePath = new eniro.maps.MapArray();
        data.coordinates.forEach(function (coordinate) {
            linePath.push(new eniro.maps.LatLng(coordinate.latitude, coordinate.longitude));
        });
        line = new eniro.maps.Polyline({
            map: map,
            path: linePath
        });
    };
});