'use strict';
var chartModule = angular.module("chartModule");
chartModule.service("journeyService", function ($rootScope, socket) {
    var journey;

    this.createJourney = function () {
        //create on the server in the future
        journey = {
            createdTime: new Date(),
            startPosition: $rootScope.coordinates
        };

        $rootScope.$broadcast('journeyCreated', journey);

        return journey;
    };

    this.getJourney = function () {
        return journey;
    };
});