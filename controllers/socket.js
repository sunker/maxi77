var weatherService = require("../services/weatherService");

module.exports = function (socket) {

  var updateWeatherForecasts = function() {    
    var updateWeatherAttempts = 0; 

    weatherService.getForecasts().then(
          function(result){
            updateForecasts = 0;
            socket.emit('forecastUpdated', result);
            
          },
          function(error){
            updateWeatherAttempts++;
            if (updateWeatherAttempts > 0) {
              socket.emit('forecastUpdatedFailed', result);   
            }          
          }
        )
  };
  var counter = 0;
  var updateGPSCoordinates = function() {
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
    socket.emit('coordinatesUpdates', { coordinates: coords});
  };

  //Load on connect
  updateWeatherForecasts();
  updateGPSCoordinates();



  //Shieldings
  setInterval(function(){      
      updateWeatherForecasts();
  }, 30000);

  setInterval(function(){      
      updateGPSCoordinates();
  }, 5000);
  
};
