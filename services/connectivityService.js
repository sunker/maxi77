const dns = require('dns'),
    q = require('q');

const connectivityService = {};

connectivityService.checkInternetConnection  = function () {
    const defer = q.defer();
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