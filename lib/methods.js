var Meteor = this.Meteor;
var moment = this.moment;
var _ = this._;

Meteor.methods({

    //TODO only for logged user or admin
    editAboStart: function(userId, purchaseDate, aboStart, newAboStart) {
        var user = Meteor.user();
        if (user && user.profile && user.profile.isAdmin) {
            if (moment(aboStart, 'YYYY-MM-DD').isValid()) {
                var abos = Meteor.users.findOne(userId).profile.abos;
                _.findWhere(abos, {purchaseDate: purchaseDate, aboStart: aboStart}).aboStart = newAboStart;

                Meteor.users.update(userId, {$set: {'profile.abos': abos}});
            }
        }
    },

    merge: function(userIds) {
        var user = Meteor.user();
        if (user && user.profile && user.profile.isAdmin) {
            var users = Meteor.users.find({_id: {$in: userIds}}).fetch();

            Meteor.users.remove({_id: {$in: _.tail(userIds)}});
            Meteor.users.update(
                _.first(userIds),
                {
                    $set: {
                        'profile.presences': _.extend.apply(
                            this,
                            [{}].concat(
                                _.map(users, function(user) {
                                    return user.profile.presences;
                                })
                            )
                        ),
                        'profile.memberships': [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.profile.memberships;
                            })
                        ),
                        'profile.tickets': [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.profile.tickets;
                            })
                        ),
                        'profile.abos': [].concat.apply([],
                            _.map(users, function(user) {
                                return user.profile.abos;
                            })
                        ),
                        emails: [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.emails;
                            })
                        ),
                    }
                }
            );
        }
    }
});
