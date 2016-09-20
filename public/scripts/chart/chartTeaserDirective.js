'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function () {

    return {
        restrict: "E",
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function (scope, elem, attr) {
        },
        scope: {
            displayZoom: '=displayZoom'
        },
        controller: 'chartTeaserController',
    }
});