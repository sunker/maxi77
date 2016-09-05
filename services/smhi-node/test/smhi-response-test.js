var should = require("should"),
    mockResponse = require("./mock-response"),
    Response = require("../src/smhi-response.js");

describe("SMHI Response Objects", function() {

  it("should fail if doesnt wrap all properties in a successful response from SMHIs API", function() {
    var unit = new Response(null, mockResponse);
    var forecasts = unit.getForecasts();
    forecasts.length.should.equal(77);

    var firstForecast = forecasts[0];

    firstForecast.getLatitude().should.equal(58.548703);
    firstForecast.getLongitude().should.equal(16.155116);
    firstForecast.getReferencetime().toISOString().should.equal("2014-03-14T20:00:00.000Z");
    firstForecast.getValidTime().toISOString().should.equal("2014-03-14T21:00:00.000Z");
    firstForecast.getMeanSeaLevel().should.equal(990.8);
    firstForecast.getTemperature().should.equal(5.3);
    firstForecast.getVisibility().should.equal(16);
    firstForecast.getWindDirection().should.equal(211);
    firstForecast.getWindVelocity().should.equal(6.6);
    firstForecast.getRelativeHumidity().should.equal(87);
    firstForecast.getThunderstormProbability().should.equal(0);
    firstForecast.getTotalCloudCover().should.equal(6);
    firstForecast.getLowCloudCover().should.equal(5);
    firstForecast.getMediumCloudCover().should.equal(8);
    firstForecast.getHighCloudCover().should.equal(6);
    firstForecast.getGust().should.equal(10.2);
    firstForecast.getTotalPrecipitationIntensity().should.equal(1.7);
    firstForecast.getSnowPrecipitationIntensity().should.equal(0);
    firstForecast.getPrecipitationCategory().should.equal(3);
  });

  it("should fail if response doesn't include the original json", function() {
    var unit = new Response(null, mockResponse);
    var json = unit.getJSON();
    mockResponse.should.equal(json);
  });

  it("should fail if the response doesn't include latitude, longitude and reference time", function() {
    var unit = new Response(null, mockResponse);
    unit.getLatitude().should.equal(58.548703);
    unit.getLongitude().should.equal(16.155116);
    unit.getReferencetime().toISOString().should.equal("2014-03-14T20:00:00.000Z");
  });

});