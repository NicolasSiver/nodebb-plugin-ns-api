(function (Plugin) {
    'use strict';

    var async          = require('async'),

        routes         = require('./app/routes'),
        nodebb         = require('./app/nodebb'),
        db             = nodebb.db,
        passport       = nodebb.passport,
        BearerStrategy = require('passport-http-bearer').Strategy;

    //NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
    Plugin.hooks = {
        statics: {
            load: function (params, callback) {
                var middleware = data.middleware,
                    router     = data.router;

                router.use('/api/ns', routes(middleware));

                // Set up HTTP bearer authentication via Passport
                passport.use(new BearerStrategy({}, function (token, done) {
                    // Same algorithm as you can find in `write-api`
                    // Find the user by token.  If there is no user with the given token, set
                    // the user to `false` to indicate failure.  Otherwise, return the
                    // authenticated `user`.
                    async.parallel({
                        uid   : async.apply(db.getObjectField, 'writeToken:uid', token),
                        master: async.apply(db.isSetMember, 'masterTokens', token)
                    }, function (error, results) {
                        if (error) {
                            return done(error);
                        }

                        var result = false;

                        if (results.uid) {
                            result = {
                                uid: parseInt(results.uid)
                            };
                        } else if (results.master) {
                            result = {
                                master: true
                            };
                        }

                        done(null, result);
                    });
                }));

                callback();
            }
        }
    };

})(module.exports);