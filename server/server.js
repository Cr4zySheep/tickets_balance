var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;

//Only on the server
//Contains all the purchase
Meteor.publish("purchase", function() {
    if(this.userId) {
        return purchase.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
    }
});

Meteor.publish("presence", function() {
    if(this.userId) {
        return presence.find({userId: this.userId});
    }
});