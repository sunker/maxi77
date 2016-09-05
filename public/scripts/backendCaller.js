'use strict';

var weatherModule = angular.module("weatherModule");

weatherModule.service('backendCaller', function ($http, $q) {

    this.sendGet = function (url, parameters) {
        return $http.get('/api/' + url, {params:{parameters}} ).then(handleSuccess, handleError);
    };

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(res) {
        return $q.reject(res.data);
    }
});