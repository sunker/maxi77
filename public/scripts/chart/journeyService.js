'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("journeyService", function ($rootScope, socket) {
    var journey;

    this.createJourney = function () {
        $scope.createJourney = function () {
            socket.emit('createJourney', { coordinates: $scope.coordinates });
            $scope.loadingJourney = true;
        };
    };

    // this.getJourney = function () {
    //     return journey;
    // };
});