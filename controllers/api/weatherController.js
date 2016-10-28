const express = require('express');
const router = express.Router();
const weatherService = require('../../services/weatherService');

router.get('/getforecasts', function (req, res) {
  weatherService.getForecasts().then(function (response) {
    res.json(response);
  },
  function () {
    res.status(500).send('Weatherservice is down');
  });
});

module.exports = router;