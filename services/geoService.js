var Q = require('q');

var geoService = {};

var counter = 0;

//return the coordinates from the GPS module in the rpi. but for now...
geoService.getCoordinates = function () {

    var defer = Q.defer();

    var coords =  { long: 18.498655, lat: 59.098031 };
    if(counter%4 === 0){
       coords =  { long: 18.298655, lat: 59.098031 };
    } else if(counter%3 === 0){      
       coords =  { long: 18.598655, lat: 59.198031 };
    } else if(counter%2 === 0){
      coords =  { long: 18.398655, lat: 59.128031 };
    } else if(counter%1 === 0){
      coords =  { long: 18.498655, lat: 59.098031 };
    } 
    counter++;
    if(counter == 4) counter = 0;

    defer.resolve(coords);

    return defer.promise;
};


module.exports = geoService;
