'use strict';
var chartModule = angular.module('chartModule');
chartModule.service('journeyService', function ($scope, socket) {
    this.createJourney = function () {
        $scope.createJourney = function () {
            socket.emit('createJourney', {
                coordinates: $scope.coordinates
            });
            $scope.loadingJourney = true;
        };
    };

    // this.getJourney = function () {
    //     return journey;
    // };
});