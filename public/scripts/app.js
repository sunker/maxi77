angular.module('maxiApp', 
    ['ngRoute', 'appRoutes', 'HomeCtrl', 'weatherModule', 'geoModule', 'chartModule', 'socketModule']);

angular.module("weatherModule", []);
angular.module("chartModule", []);
angular.module("socketModule", []);