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

  //Load on connect
  updateWeatherForecasts();



  //Shieldings
  setInterval(function(){      
      updateWeatherForecasts();
  }, 1000);
  
};
