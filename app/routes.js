(function (Module) {
    "use strict";

    var nodebb = require('./nodebb');

    Module.exports = function (payload, callback) {
        var router        = payload.router,
            apiMiddleware = payload.apiMiddleware,
            middleware    = payload.coreMiddleware,
            errorHandler  = payload.errorHandler;

        callback(null, payload);
    };

})(module);