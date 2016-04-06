var Meteor = this.Meteor;

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

Meteor.publish("members", function() {
    if (isAdmin(this.userId)) {
        return Meteor.users.find({'profile.memberships':{$ne:[]}},{'emails.address':1, 'profile.memberships':1, _id:0});
    }
    return [];
});

Meteor.publish("logs", function() {
    if (isAdmin(this.userId)) {
        return Meteor.logs.find();
    }
    return [];
});
