angular.module('maxiApp', 
    ['ngRoute', 'appRoutes', 'HomeCtrl', 'weatherModule', 'geoModule', 'chartModule']);

angular.module("weatherModule", []);
angular.module("chartModule", []);