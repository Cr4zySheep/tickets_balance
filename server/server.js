var Meteor = this.Meteor;

// db.users.update({_id:""},{$set:{"profile.isAdmin":true}})
Meteor.publish("allUsers", function() {
    if (Meteor.isAdmin(this.userId)) {
        return Meteor.users.find();
    }
    return [];
});

Meteor.publish("members", function() {
    if (Meteor.isAdmin(this.userId)) {
        return Meteor.users.find({'profile.memberships':{$ne:[]}},{'emails.address':1, 'profile.memberships':1, _id:0});
    }
    return [];
});

Meteor.publish("logs", function() {
    if (Meteor.isAdmin(this.userId)) {
        return Meteor.logs.find();
    }
    return [];
});
