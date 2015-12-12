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
