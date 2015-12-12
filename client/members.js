var Template = this.Template;
var _ = this._;
var Meteor = this.Meteor;
var moment = this.moment;

Template.members.onCreated(function(){
    this.subscribe("members");
});

Template.members.helpers({
    members: function() {
        var members = Meteor.users.find().fetch().map(function(user){
            var sortedMemberships = _.pluck(user.profile.memberships, 'membershipStart').sort();
            return {
                emails: _.pluck(user.emails, 'address').join(', '),
                latestMembership: _.last(sortedMemberships),
                otherMemberships: _.initial(sortedMemberships),
            };
        });

        return _.sortBy(members, 'latestMembership').reverse();
    },
});

Template.member.helpers({
    isOutdated: function() {
        var oneYearAgo = moment().subtract(1, 'year');
        return moment(this.latestMembership).isBefore(oneYearAgo);
    },
});
