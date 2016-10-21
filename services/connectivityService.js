var dns = require('dns'),
    q = require('q');

var connectivityService = {};

connectivityService.checkInternetConnection  = function () {
    var defer = q.defer();
    dns.lookupService('8.8.8.8', 53, function (err) {
        if(err){
            return defer.resolve(false);
        } else {
            return defer.resolve(true);
        }
    });
    return defer.promise;
};

module.exports = connectivityService;