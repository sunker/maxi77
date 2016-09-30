'use strict';
var chartModule = angular.module("geoModule");
chartModule.service("geoService", function () {
    var noOfCoordinatesToBaseSpeedCalculationOn = 3; //Feel free to edit
    var coordinates = [];

    this.getCurrentSpeed = function (newCoordinate) {
        // console.log("New point " + newCoordinate.lat + " " +  newCoordinate.long);
        addCoordinate(newCoordinate);
        if (coordinates.length === 1) return 0.00;

        var currentCoordinate = coordinates[0];
        var totalSpeed = 0;
        for (var i = 1; i < coordinates.length; i++) {
            var speed = getSpeedBetweenTwoCoordinates(currentCoordinate, coordinates[i]);
            // console.log(speed);
            totalSpeed = totalSpeed + speed;
            currentCoordinate = coordinates[i];
        }

        return totalSpeed / coordinates.length;
    };

    this.getDistanceInMetersBetweenLastTwoCoordinates = function () {
        if(coordinates.length < 2) return 0.00;
        var start = coordinates[coordinates.length -2];
        var end = coordinates[coordinates.length -1];
        var distance = geolib.getDistance(
            { latitude: start.lat,  longitude: start.lng },
            { latitude: end.lat,  longitude: end.lng },
            1,
            3);
        
        return distance;
    };

    this.metersToSeaMiles = function (meters) {
        return geolib.convertUnit('sm', meters, 10);
    };

    var getSpeedBetweenTwoCoordinates = function (coord1, coord2) {
        return geolib.getSpeed(
            { lat: coord1.lat, lng: coord1.lng, time: coord1.time },
            { lat: coord2.lat, lng: coord2.lng, time: coord2.time }
            // {unit: 'nm'}
        );
    };

    var addCoordinate = function (newCoordinate) {
        coordinates.push(convertToGeoLibCoordinate(newCoordinate));

        if (coordinates.length > (noOfCoordinatesToBaseSpeedCalculationOn)) {
            coordinates.shift();
        }
    };

    var convertToGeoLibCoordinate = function (coordinate) {
        return {
            lat: coordinate.lat,
            lng: coordinate.long,
            time: coordinate.timestamp
        };
    };    
});