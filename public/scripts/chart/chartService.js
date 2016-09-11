'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("chartService", function(){
    
    var map, marker;

    this.getMap = function(htmlElement) {
        if (!map) {
            map = new eniro.maps.Map(htmlElement, {
                // center: new eniro.maps.LatLng(coordinates.lat, coordinates.long),
                zoom: 9,
                mapTypeId: eniro.maps.MapTypeId.NAUTICAL,
                mapTypeControl: false,
                zoomControl: false,
                focus: true
            });
        } 
        
        return map;
    };

    this.getPositionMarker = function(){
        if(!marker && map){
            marker = new eniro.maps.Marker({                
                map: map
            });
            return marker;
        } else if (marker && map){
            return marker;
        }
        new Error("Map doesn't exist");
    };
});