var weatherModule = angular.module('weatherModule');
weatherModule.service('weatherService', function () {

    this.getCurrentForecastFromForecasts = function (forecasts) {
        var nextHour = forecasts[0];

        for (var i = 0; i < forecasts.length; i++) {
            if (new Date().getHours() === new Date(forecasts[i].validTime).getHours()) {
                return forecasts[i];
            }
        }

        return nextHour;
    };

    this.getUpcomingForecastByForecasts = function (forecasts) {
        var result = [];

        for (var i = 0; i < forecasts.length; i++) {
            var forecastDate = new Date(forecasts[i].validTime);
            if (forecastDate.getHours() >= new Date().getHours()) {
                result.push(forecasts[i]);
            }
        }

        return result;
    };

    this.getTime = function (date) {
        if (date.getDay() === new Date().getDay()) {
            return 'kl ' + date.getHours();
        } else if (date.getDay() === (new Date().getDay() + 1)) {
            return 'imorgon kl ' + date.getHours();
        } else {
            return date.toSwedishDay() + ' kl ' + date.getHours(); //this.getSwedishWeekday(date.getDay()) + " kl " + date.getHours();
        }
    };

    this.convertWindDirectionToText = function (windDirection) {
        var val = Math.floor((windDirection / 22.5) + 0.5);
        var arr = ['nordlig', 'nord nordöstlig', 'nordöst', 'öst nordöstlig', 'östlig', 'öst sydöstlig', 'sydöstlig', 'syd sydöstlig', 'sydlig', 'syd sydvästlig', 'sydvästlig', 'väst sydvästlig', 'västlig', 'väst nordvästlig', 'nordvästlig', 'nord nordvästlig'];
        return arr[(val % 16)];
    };

    this.getPrecipitation = function (forecast) {
        var mean = (forecast.minimumPrecipitationIntensity.value ? forecast.minimumPrecipitationIntensity.value : forecast.minimumPrecipitationIntensity.values[0]);
        var high = (forecast.maximumPrecipitationIntensity.value ? forecast.maximumPrecipitationIntensity.value : forecast.maximumPrecipitationIntensity.values[0]);
        return mean + ' (' + high + ') mm';
    };

    this.convertWeatherTypeToText = function (value) {

        switch (value) {
            case 1:
                return 'klart';
            case 2:
                return 'mestadels klart';
            case 3:
                return 'växlande molnighet';
            case 4:
                return 'halvklart';
            case 5:
                return 'molnigt';
            case 6:
                return 'mulet';
            case 7:
                return 'dimma';
            case 8:
                return 'regnskurar';
            case 9:
                return 'åskskurar';
            case 10:
                return 'byar av snöblandat regn';
            case 11:
                return 'snöbyar';
            case 12:
                return 'regn';
            case 13:
                return 'åska';
            case 14:
                return 'snöblandat regn';
            case 15:
                return 'snöfall';
            default:
                return '';
        }
    };
});