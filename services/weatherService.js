const SMHI = require('smhi-node'),
    Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    connection = require('./connectivityService');
let instance;

const WeatherService = function () {
    const self = this;

    this.startPollingForForecasts = (coordinate, allowFakeForecasts) => {
        updateAndEmit(coordinate, allowFakeForecasts);
        setInterval(() => {
            updateAndEmit(coordinate);
        }, 15000);
    };

    this.getFakeForecasts = () => {
        const deferred = Q.defer();

        fs.readFile('./SMHITestData.json', 'utf8', (data1, data2) => {
            const file = JSON.parse(data2.toString());
            return deferred.resolve(file);
        });

        return deferred.promise;
    };

    this.getForecasts = (coordinate) => {
        const deferred = Q.defer();
        if (coordinate === null) {
            coordinate = {
                lat: 59,
                lng: 18
            }; // Sthml coordinate
        }
        SMHI.getForecastForLatAndLong(coordinate.lat.toFixed(6), coordinate.lng.toFixed(6)).then(
            (response) => {
                const forecasts = response.getForecasts();
                const result = [forecasts.length];

                

                for (let i = 0; i < forecasts.length; i++) {
                    result[i] = buildJson(forecasts[i]);
                }

                return deferred.resolve(result);
            },
            () => {
                deferred.reject('Weather service down');
            }
        );

        return deferred.promise;
    };

    let fakeForecasts;
    let updateAndEmit = (coordinate, allowFakeForecasts) => {
        fakeForecasts = allowFakeForecasts;
        connection.checkInternetConnection().then((isConnected) => {
            if (!isConnected && fakeForecasts) {
                self.getFakeForecasts().then(
                    (success) => {
                        self.emit('weatherForecastUpdated', success);
                    },
                    (fail) => {
                        //Replace this with error when in production...
                        self.emit('forecastUpdatedFailed', fail);
                        console.log('Could not load SMHI data. Sending cashed data');
                    });
            } else {
                self.getForecasts(coordinate).then(
                    (success) => {
                        self.emit('weatherForecastUpdated', success);
                    },
                    (fail) => {
                        self.emit('forecastUpdatedFailed', fail);
                        console.log('Could not load SMHI data. Sending cashed data');
                    });
            }
        });

    };

    let buildJson = (forecast) => {
        return {
            temperature: forecast.getTemperature(),
            meanSeanLevel: forecast.getMeanSeaLevel(),
            validTime: forecast.getValidTime(),
            lastUpdated: forecast.getReferencetime(),
            visibility: forecast.getVisibility(),
            windDirection: forecast.getWindDirection(),
            windVelocity: forecast.getWindVelocity(),
            windGust: forecast.getGust(),
            relativeHumidity: forecast.getRelativeHumidity(),
            thunderstormProbability: forecast.getThunderstormProbability(),
            maximumPrecipitationIntensity: forecast.getMaximumPrecipitationIntensity(),
            minimumPrecipitationIntensity: forecast.getMinimumPrecipitationIntensity(),
            precipitationType: getSwedishPrecipitationType(forecast.getPrecipitationCategory()),
            swedishWeatherType: forecast.getWeatherSymbol()
        };
    };

    let getSwedishPrecipitationType = (precipitationCategory) => {

        switch (precipitationCategory.values[0]) {
            case 1:
                return 'snö';
            case 2:
                return 'snöblandat regn';
            case 3:
                return 'regn';
            case 4:
                return 'duggregn';
            case 5:
                return 'underkylt regn';
            case 6:
                return 'underkylt duggregn';
            default:
                return null;
        }
    };
};

util.inherits(WeatherService, EventEmitter);

module.exports = {
    getInstance: () => {
        return instance || (instance = new WeatherService());
    }
};