var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;

Meteor.publish("allUsers", function() {
    //TODO only for admins
    return Meteor.users.find();
});

Meteor.publish("purchase", function(userId) {
    return purchase.find({userId: userId});
});

Meteor.publish("presence", function(userId) {
    return presence.find({userId: userId});
});
