var chartModule = angular.module('chartModule');
chartModule.directive('chart', function () {

    return {
        restrict: 'E',
        templateUrl: 'scripts/chart/chartTemplate.html',
        link: function () {},
        scope: {
            displayZoom: '=displayZoom',
            mapHeight: '@mapHeight'
        },
        controller: 'chartController',
    };
});