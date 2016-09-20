'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chart', function () {

    return {
        restrict: "E",
        templateUrl: 'scripts/chart/chartTemplate.html',
        link: function (scope, elem, attr) {
        },
        scope: {
            displayZoom: '=displayZoom'
        },
        controller: 'chartController',
    }
});