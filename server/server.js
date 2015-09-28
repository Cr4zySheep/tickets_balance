var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;

function isAdmin(userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user && user.profile && user.profile.isAdmin;
}

// db.users.update({_id:""},{$set:{"profile.isAdmin":true}})
Meteor.publish("allUsers", function() {
    if (isAdmin(this.userId)) {
        return Meteor.users.find();
    }
    return [];
});

Meteor.publish("purchase", function(userId) {
    if (isAdmin(this.userId) || userId === this.userId) {
        return purchase.find({userId: userId});
    }
    return [];
});

Meteor.publish("presence", function(userId) {
    if (isAdmin(this.userId) || userId === this.userId) {
        return presence.find({userId: userId});
    }
    return [];
});
