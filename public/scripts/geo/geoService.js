var chartModule = angular.module('geoModule');
chartModule.service('geoService', function (socket) {
    var noOfCoordinatesToBaseSpeedCalculationOn = 3, //Feel free to edit
        coordinates = [];

    this.getCurrentSpeed = function () {
        if (coordinates.length === 1) return 0.00;

        var currentCoordinate = coordinates[0],
            totalSpeed = 0;
        for (var i = 1; i < coordinates.length; i++) {
            var speed = getSpeedBetweenTwoCoordinates(currentCoordinate, coordinates[i]);
            totalSpeed = totalSpeed + speed;
            currentCoordinate = coordinates[i];
        }

        return totalSpeed / coordinates.length;
    };

    this.getDistanceInMetersBetweenLastTwoCoordinates = function () {
        if (coordinates.length < 2) return 0.00;
        var start = coordinates[coordinates.length - 2],
            end = coordinates[coordinates.length - 1];

        var distance = geolib.getDistance({
                latitude: start.lat,
                longitude: start.lng
            }, {
                latitude: end.lat,
                longitude: end.lng
            },
            1,
            3);

        return distance;
    };

    this.getBearing = function () {
        if (coordinates.length < 2) return 0.00;
        var start = coordinates[0],
            end = coordinates[coordinates.length - 1];
        return geolib.getBearing({
            latitude: start.lat,
            longitude: start.lng
        }, {
            latitude: end.lat,
            longitude: end.lng
        });
    };

    this.getCompassDirection = function () {
        var bearing = this.getBearing(),
            val = Math.floor((bearing / 22.5) + 0.5),
            arr = ['N', 'NNÖ', 'NÖ', 'ÖNÖ', 'Ö', 'ÖSÖ', 'SÖ', 'SSÖ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV'];
        return arr[(val % 16)];
    };

    this.getCurrentCoordinate = function () {
        return coordinates.length === 0 ? {
            lat: 0,
            lng: 0,
            timestamp: new Date().getTime()
        } : coordinates[coordinates.length - 1];
    };

    this.metersToSeaMiles = function (meters) {
        return geolib.convertUnit('sm', meters, 10);
    };

    this.formatCoordinate = function (coordinate) {
        return {
            lat: coordinate.lat.toFixed(5).toString().replace('.', '°').insertAt(5, '.') + 'N',
            lng: coordinate.lng.toFixed(5).toString().replace('.', '°').insertAt(5, '.') + 'E'
        };
    };

    var getSpeedBetweenTwoCoordinates = function (coord1, coord2) {
        return geolib.getSpeed({
                lat: coord1.lat,
                lng: coord1.lng,
                time: coord1.time
            }, {
                lat: coord2.lat,
                lng: coord2.lng,
                time: coord2.time
            }
            // {unit: 'nm'}
        );
    };

    var convertToGeoLibCoordinate = function (coordinate) {
        return {
            lat: coordinate.lat,
            lng: coordinate.lng,
            time: coordinate.timestamp
        };
    };

    socket.on('coordinatesUpdated', function (data) {
        coordinates.push(convertToGeoLibCoordinate(data.coordinates));

        if (coordinates.length > (noOfCoordinatesToBaseSpeedCalculationOn)) {
            coordinates.shift();
        }
    });
});