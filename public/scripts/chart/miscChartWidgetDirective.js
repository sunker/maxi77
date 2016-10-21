var chartModule = angular.module('chartModule');
chartModule.directive('miscChartWidget', function () {

    return {
        restrict: 'E',
        templateUrl: 'scripts/chart/miscChartWidgetTemplate.html',
        link: function () {},
        scope: {},
        controller: 'miscChartWidgetController',
    };
});