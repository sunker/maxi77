'use strict';
var chartModule = angular.module("geoModule");
chartModule.service("geoService", function () {
    var noOfCoordinatesToBaseSpeedCalculationOn = 5; //Feel free to edit
    var coordinates = [];

    this.getCurrentSpeed = function (newCoordinate) {
        // console.log("New point " + newCoordinate.lat + " " +  newCoordinate.long);
        addCoordinate(newCoordinate);
        if (coordinates.length === 1) return 0.00;

        var currentCoordinate = coordinates[0];
        var totalSpeed = 0;
        for (var i = 1; i < coordinates.length; i++) {
            var speed = getSpeedBetweenTwoCoordinates(currentCoordinate, coordinates[i]);
            totalSpeed = totalSpeed + speed;
            currentCoordinate = coordinates[i];
        }

        return totalSpeed / coordinates.length;
    };

    var addCoordinate = function (newCoordinate) {
        coordinates.push({
            lat: newCoordinate.lat,
            lng: newCoordinate.long,
            time: newCoordinate.timestamp
        });

        if (coordinates.length > (noOfCoordinatesToBaseSpeedCalculationOn)) {
            coordinates.pop();
        }
    };

    var getSpeedBetweenTwoCoordinates = function (coord1, coord2) {
        return geolib.getSpeed(
            { lat: coord1.lat, lng: coord1.lng, time: coord1.time },
            { lat: coord2.lat, lng: coord2.lng, time: coord2.time }
            // {unit: 'nm'}
        );
    };
});