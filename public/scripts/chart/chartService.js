'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function (geoService) {
    var map, marker, line;
    var linePath;
    var redMarkers = [];
    var journeyMode = false;
    var autoFocus = true;

    this.initialize = function (parentDiv) {
        try {
            map = new eniro.maps.Map(parentDiv, {
                zoom: 10,
                mapTypeId: eniro.maps.MapTypeId.NAUTICAL,
                mapTypeControl: false,
                zoomControl: false,
                focus: true
            });

           eniro.maps.event.addListener(map, 'click', function(event){
                alert(event);
            });

            var coord = geoService.getCurrentCoordinate();
            map.panTo(new eniro.maps.LatLng(coord.lat, coord.lng));

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
        } catch (ex) {
            return false;
        }
    };

    this.setPositionMarker = function (lat, lng) {
        if (journeyMode) {
            linePath.push(new eniro.maps.LatLng(lat, lng));
        } else {
            marker.setPosition(new eniro.maps.LatLng(lat, lng));
        }

        if (autoFocus){
            map.panTo(new eniro.maps.LatLng(lat, lng));
        }
    };

    this.panTo = function(lat, lng) {
        map.panTo(new eniro.maps.LatLng(lat, lng));
    }

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
        
        redMarkers.forEach(function(redMarker){
            redMarker.setVisible(false);
        });
        redMarkers = [];        
    };

    this.loadJourney = function (data) {
        journeyMode = true;
        marker.setVisible(false);
        map.setZoom(data.zoom_level);
        linePath = new eniro.maps.MapArray();
        for (var i = 0; i < data.coordinates.length; i++) {
            var coordinate = data.coordinates[i];
            if (coordinate.is_MOB) {
                this.addRedMarker({ lat: coordinate.latitude, lng: coordinate.longitude })
            }
            linePath.push(new eniro.maps.LatLng(coordinate.latitude, coordinate.longitude));
        }
        line = new eniro.maps.Polyline({
            map: map,
            path: linePath
        });
    };
    
    this.setAutoFocus = function(focus) {
        autoFocus = focus;
        console.log("Autofocus: " + focus);
    }

    this.addRedMarker = function (coordinate) {
        var redMarker = new eniro.maps.Marker({
            map: map,
            position: new eniro.maps.LatLng(0, 0), //WAT?
            icon: new eniro.maps.MarkerImage('../../images/MOB.png', new eniro.maps.Size(24, 24), new eniro.maps.Point(0, 0), new eniro.maps.Point(11, 13), 0, 0)
        });
        redMarker.setPosition(new eniro.maps.LatLng(coordinate.lat, coordinate.lng));
        redMarkers.push(redMarker);
    };
});