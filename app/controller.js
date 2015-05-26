(function (Controller) {
    "use strict";

    var async  = require('async'),

        nodebb = require('./nodebb'),
        db     = nodebb.db,
        groups = nodebb.groups;

    Controller.getUserGroups = function (uid, callback) {
        var groupsData;

        async.waterfall([
            async.apply(db.getSortedSetRevRange, 'groups:createtime', 0, -1),
            function (groupNames, next) {
                var groupObjects = groupNames.map(function (name) {
                    return 'group:' + name;
                });

                db.getObjectsFields(groupObjects, ['name'], next);
            },
            function (groupData, next) {
                groupsData = groupData;

                var groupSets = groupData.map(function (group) {
                    return 'group:' + group.name + ':members';
                });

                db.isMemberOfSortedSets(groupSets, uid, next);
            },
            function (membership, next) {
                var memberOf = [];
                membership.forEach(function (isMember, index) {
                    if (isMember) {
                        memberOf.push(groupsData[index].name);
                    }
                });

                groups.getGroupsData(memberOf, next);
            }
        ], callback);
    };

})(module.exports);