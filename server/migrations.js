var Meteor = this.Meteor;
var Mongo = this.Mongo;
var _ = this._;

this.Migrations.add({
    version: 1,
    name: 'Move purchase and presence into user profiles',
    up: function() {
        var purchase = new Mongo.Collection('purchase');
        var presence = new Mongo.Collection('presence');

        _.map(
            _.groupBy(presence.find().fetch(), 'userId'),
            function(presences) {
                Meteor.users.update(
                    presences[0].userId,
                    {
                        $set: {
                            'profile.presences': _.object(
                                _.map(
                                    presences,
                                    function(p){
                                        return [p.date, p.amount];
                                    }
                                )
                            )
                        }
                    }
                );
            }
        );

        _.map(
            _.groupBy(purchase.find({membershipStart:{$exists: true}}).fetch(), 'userId'),
            function(purchases) {
                Meteor.users.update(
                    purchases[0].userId,
                    {
                        $set: {
                            'profile.memberships': _.map(
                                purchases,
                                function(p){
                                    return _.omit(p, ['_id', 'userId']);
                                }
                            )
                        }
                    }
                );
            }
        );
        _.map(
            _.groupBy(purchase.find({aboStart:{$exists: true}}).fetch(), 'userId'),
            function(purchases) {
                Meteor.users.update(
                    purchases[0].userId,
                    {
                        $set: {
                            'profile.abos': _.map(
                                purchases,
                                function(p){
                                    return _.omit(p, ['_id', 'userId']);
                                }
                            )
                        }
                    }
                );
            }
        );
        _.map(
            _.groupBy(purchase.find({tickets:{$exists: true}}).fetch(), 'userId'),
            function(purchases) {
                Meteor.users.update(
                    purchases[0].userId,
                    {
                        $set: {
                            'profile.tickets': _.map(
                                purchases,
                                function(p){
                                    return _.omit(p, ['_id', 'userId']);
                                }
                            )
                        }
                    }
                );
            }
        );

        Meteor.users.update(
            {'profile.presences': {$exists:false}},
            {$set: { 'profile.presences': {} }},
            {multi: true}
        );
        Meteor.users.update(
            {'profile.memberships': {$exists:false}},
            {$set: { 'profile.memberships': [] }},
            {multi: true}
        );
        Meteor.users.update(
            {'profile.abos': {$exists:false}},
            {$set: { 'profile.abos': [] }},
            {multi: true}
        );
        Meteor.users.update(
            {'profile.tickets': {$exists:false}},
            {$set: { 'profile.tickets': [] }},
            {multi: true}
        );

    },
    down: function() {return;}, //code to migrate down to version 0
});

Meteor.startup(
    function () {
        this.Migrations.migrateTo('1');
    }
);
