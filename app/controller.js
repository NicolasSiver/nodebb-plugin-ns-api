(function (Controller) {
    "use strict";

    var async  = require('async'),

        nodebb = require('./nodebb'),
        db     = nodebb.db,
        groups = nodebb.groups;

    Controller.getUserGroups = function (uid, callback) {
        db.getSortedSetRevRange('groups:createtime', 0, -1, function (error, groupNames) {
            if (error) {
                return callback(error);
            }

            var groupObjects = groupNames.map(function (name) {
                return 'group:' + name;
            });

            db.getObjectsFields(groupObjects, ['name'], function (error, groupData) {
                if (error) {
                    return callback(error);
                }

                var groupSets = groupData.map(function (group) {
                    return 'group:' + group.name + ':members';
                });

                db.isMemberOfSortedSets(groupSets, uid, function (err, membership) {
                    if (err) {
                        return callback(err);
                    }

                    var memberOf = [];
                    membership.forEach(function (isMember, index) {
                        if (isMember) {
                            memberOf.push(groupData[index].name);
                        }
                    });

                    groups.getGroupsData(memberOf, callback);
                });
            });

        });
    };

})(module.exports);