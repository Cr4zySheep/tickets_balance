var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;
var moment = this.moment;
var _ = this._;

Meteor.methods({
    //TODO only for logged user or admin
    editAboStart: function(idAbo, aboStart) {
        if (moment(aboStart, 'YYYY-MM-DD').isValid()) {
            purchase.update(idAbo, {
                $set: {
                    aboStart: aboStart,
                }
            });
        }
    },
    merge: function(userIds) {
        if (Meteor.isClient) return;
        var user = Meteor.user();
        if (user && user.profile && user.profile.isAdmin) {
            if (_.all(userIds, function(userId) {return Meteor.users.findOne(userId);})) {
                if (userIds.length > 1) {
                    _.reduce(
                        userIds,
                        function(merged, toMerge) {
                            var presenceToMerge = presence.find({userId:toMerge});
                            presenceToMerge.fetch().map(function(presenceToMerge){
                                var presenceMerged = presence.findOne({userId: merged, date: presenceToMerge.date});
                                if (presenceMerged) {
                                    presence.update(
                                        {date: presenceToMerge.date, userId: merged},
                                        {$set: {amount: Math.max(presenceToMerge.amount, presenceMerged.amount)}}
                                    );
                                } else {
                                    presence.insert({
                                        date: presenceToMerge.date,
                                        userId: merged,
                                        amount: presenceToMerge.amount,
                                    });
                                }
                                presence.remove({userId: presenceToMerge.userId});
                            });

                            purchase.update(
                                {userId: toMerge},
                                {$set: {userId: merged}},
                                {multi: true}
                            );

                            emailsToMerge = Meteor.users.findOne(toMerge).emails;
                            Meteor.users.remove(toMerge)
                            Meteor.users.update(
                                {_id: merged},
                                {$push: {emails: {$each: emailsToMerge}}}
                            );

                            return merged;
                        }
                    );
                }
            }
        }
    }
});
