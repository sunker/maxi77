angular.module('maxiApp', 
    ['ngRoute', 'appRoutes', 'ngTouch', 'HomeCtrl', 'weatherModule', 'geoModule', 'chartModule', 'socketModule',]);

angular.module('weatherModule', []);
angular.module('chartModule', []);
angular.module('socketModule', []);