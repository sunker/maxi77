'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('miscChartWidget', function () {

    return {
        restrict: "E",
        templateUrl: 'scripts/chart/miscChartWidgetTemplate.html',
        link: function (scope, elem, attr) {
            // document.getElementsByClassName('chart-map')[0].on('click', function(e) {

            // });
            // elem.on('click', function(e) {

            // });
        },
        scope: {
        },
        controller: 'miscChartWidgetController',
    }
});
