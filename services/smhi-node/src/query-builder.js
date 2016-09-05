var config = require("../config");

var QueryBuilder = function() {
  this.query = this.buildBaseUrl();
};

QueryBuilder.prototype.latAndLong = function(lat, lon) {
  this.query += "geotype/point/";
  this.query += "lon/" + lon + "/";
  this.query += "lat/" + lat + "/";

  return this;
};

QueryBuilder.prototype.buildBaseUrl = function() {
  return config.host + ":" + config.port + config.apiBasePath;
};

QueryBuilder.prototype.build = function() {
  this.query += "data.json";
  return this.query;
};

module.exports = QueryBuilder;