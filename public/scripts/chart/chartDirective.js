'use strict';
var chartModule = angular.module('chartModule');
chartModule.directive('chart', function () {

    return {
        restrict: 'E',
        templateUrl: 'scripts/chart/chartTemplate.html',
        link: function (scope, elem, attr) {
            // document.getElementsByClassName('chart-map')[0].on('click', function(e) {

            // });
            // elem.on('click', function(e) {

            // });
        },
        scope: {
            displayZoom: '=displayZoom',
            mapHeight: '@mapHeight'
        },
        controller: 'chartController',
    };
});