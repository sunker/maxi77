'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function (socket, $rootScope) {
    var map, marker, line;
    var linePath;
    var journeyMode = false;

    this.resetMap = function () {
        map = undefined;
        marker = undefined;
    };

    this.initializeMap = function (parentDiv) {
        map = new eniro.maps.Map(parentDiv, {
            zoom: 9,
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
    };

    this.mapPanTo = function (htmlElement, latlong) {
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
    };

    this.zoomOut = function () {
        var zoomLevel = map.getZoom();
        map.setZoom(++zoomLevel);
    };

    var stopJourney = function () {
        journeyMode = false;
        if (marker) {            
            marker.setVisible(true);
            marker.setMap(map);
        };
        if (line) line.setMap(null);
    };

    var startJourney = function (data) {
        journeyMode = true;
        marker.setVisible(false);
        linePath = new eniro.maps.MapArray([new eniro.maps.LatLng(data.startCoordinate.latitude, data.startCoordinate.longitude)]);
        line = new eniro.maps.Polyline({
            map: map,
            path: linePath
        });
    };

    socket.on('coordinatesUpdates', function (data) {
        $rootScope.coordinates = data.coordinates;
    });

    socket.on('journeyStopped', function (data) {
        stopJourney();
    });

    socket.on('journeyCreated', function (data) {
        startJourney(data);
    });

    socket.on('currentJourneyLoaded', function (data) {
        if (data.journey) {
            startJourney(data.journey);
        } else{
            stopJourney();
        }
    });
});