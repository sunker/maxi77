'use strict';
var chartModule = angular.module("chartModule");
chartModule.directive('chartTeaser', function ($location) {

    return {
        templateUrl: 'scripts/chart/chartTeaserTemplate.html',
        link: function(scope, elem, attr) {
            elem.bind("click",
                function() {
                    //$location.url('/weather');
                });
        },
        controller: function ($scope, $http, geoLocationService) {
            geoLocationService.getCurrentPosition()
                .then(function(res) {
                    //$scope.long = res.coords.longitude;
                    //$scope.lat = res.coords.latitude;
                    //$scope.frame = "<iframe  src='http://kartor.eniro.se/m/qUZ5H?embed=true&amp;center=" + res.coords.longitude + "," + res.coords.latitude + "&amp;zoom=14&amp;layer=nautical' width='600' height='450' frameborder='0'></iframe >";
                });
        }
    }
});