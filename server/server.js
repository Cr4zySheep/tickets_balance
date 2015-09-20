var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;

Meteor.publish("purchase", function() {
    if(this.userId) {
        return purchase.find({userId: this.userId});
    }
});

Meteor.publish("presence", function() {
    if(this.userId) {
        return presence.find({userId: this.userId});
    }
});