var Response = function(error, body) {
  if (error) {
    this.error = error;
  } else {
    try {
      this.body = body;
      this.forecasts = createForecasts(body);
    } catch (exception) {
      this.error = "Unexpected error when parsing response from SMHI";
    }
  }
};

Response.prototype.getLatitude = function() {
  return this.body.lat;
};

Response.prototype.getLongitude = function() {
  return this.body.lon;
};

Response.prototype.getReferencetime = function() {
  return new Date(this.body.referenceTime);
};

Response.prototype.getJSON = function() {
  return this.body;
};

Response.prototype.getForecasts = function() {
  return this.forecasts;
};

var createForecasts = function(body) {
  var baseData = {
    lat : body.lat,
    lon : body.lon,
    referenceTime : body.referenceTime
  };
  return body.timeSeries.map(function(timeSeriesElement) {
    return new Forecast(baseData, timeSeriesElement);
  });
};

var Forecast = function(baseData, timeSeriesElement) {
  for (var baseDataKey in baseData) {
    if (baseData.hasOwnProperty(baseDataKey)) {
      this[baseDataKey] = baseData[baseDataKey];
    }
  }
  for (var elementKey in timeSeriesElement) {
    if (timeSeriesElement.hasOwnProperty(elementKey)) {
      this[elementKey] = timeSeriesElement[elementKey];
    }
  }
};

Forecast.prototype.getLatitude = function() {
  return this.lat;
};

Forecast.prototype.getLongitude = function() {
  return this.lon;
};

Forecast.prototype.getReferencetime = function() {
  return new Date(this.referenceTime);
};

Forecast.prototype.getValidTime = function() {
  return new Date(this.validTime);
};

Forecast.prototype.getMeanSeaLevel = function() {
	return this.parameters[0].valueWrapper();
};

Forecast.prototype.getTemperature = function() {	 
  return this.parameters[1].valueWrapper();
};

Forecast.prototype.getVisibility = function() {
  return this.parameters[2].valueWrapper();
};

Forecast.prototype.getWindDirection = function() {
  return this.parameters[3].valueWrapper();
};

Forecast.prototype.getWindVelocity = function() {
  return this.parameters[4].valueWrapper();
};

Forecast.prototype.getRelativeHumidity = function() {
  return this.parameters[5].valueWrapper();
};

Forecast.prototype.getThunderstormProbability = function() {
  return this.parameters[6].valueWrapper();
};

Forecast.prototype.getTotalCloudCover = function() {
  return this.parameters[7].valueWrapper();
};

Forecast.prototype.getLowCloudCover = function() {
  return this.parameters[8].valueWrapper();
};

Forecast.prototype.getMediumCloudCover = function() {
  return this.parameters[9].valueWrapper();
};

Forecast.prototype.getHighCloudCover = function() {
  return this.parameters[10].valueWrapper();
};

Forecast.prototype.getGust = function() {
  return this.parameters[11].valueWrapper();
};

Forecast.prototype.getMinimumPrecipitationIntensity = function() {
  return this.parameters[12].valueWrapper();
};

Forecast.prototype.getMaximumPrecipitationIntensity = function() {
  return this.parameters[13].valueWrapper();
};

Forecast.prototype.getPercentPrecipitationFrozenForm = function() {
  return this.parameters[14].valueWrapper();
};

Forecast.prototype.getPrecipitationCategory = function() {
  return this.parameters[15].valueWrapper();
};

Forecast.prototype.getWeatherSymbol = function() {
  return this.parameters[18].valueWrapper();
};

Object.prototype.valueWrapper = function() {	 
  this.value = this.values[0] == undefined ? undefined : this.values[0];
  return this;
};

module.exports = Response;