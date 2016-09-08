var express = require('express');
var router = express.Router();
var weatherService = require("../../services/weatherService");
// latitude = 58.59, // Stockholm
// longitude = 16.18; 

router.get('/getcurrentforecast', function (req, res) {
  var params = JSON.parse(req.query.parameters);
  weatherService.getCurrentWeather(params.long, params.lat).then(function (response) {
    res.json(response);
  },
  function (error) {
    res.status(500).send('Weatherservice is down');
  });     
});

router.get('/getforecasts', function (req, res) {
  var params = JSON.parse(req.query.parameters);
  weatherService.getForecasts(params.long, params.lat).then(function (response) {
    res.json(response);
  },
  function (error) {
    res.status(500).send('Weatherservice is down');
  });
});

module.exports = router;