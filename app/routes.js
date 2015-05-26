(function (Module) {
    "use strict";

    var async      = require('async'),

        controller = require('./controller'),
        nodebb     = require('./nodebb'),
        groups     = nodebb.groups,
        user       = nodebb.user;

    Module.exports = function (payload, callback) {
        var router        = payload.router,
            apiMiddleware = payload.apiMiddleware,
            middleware    = payload.coreMiddleware,
            errorHandler  = payload.errorHandler;

        router.get('/users/:uid/groups', apiMiddleware.requireUser, function (req, res) {
            async.parallel({
                user  : async.apply(user.getUserFields, req.params.uid, ['uid', 'username']),
                groups: async.apply(controller.getUserGroups, [req.params.uid])
            }, function (error, results) {
                if (error) {
                    return errorHandler.respond(500, res);
                } else if (!results.user) {
                    return errorHandler.respond(404, res);
                }

                res.json({
                    user  : results.user,
                    groups: results.groups
                });
            });
        });

        callback(null, payload);
    };

})(module);