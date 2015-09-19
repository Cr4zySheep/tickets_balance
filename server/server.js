//Only on the server
//Contains all the purchase
Meteor.publish("purchase", function() {
  	return purchase.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
});

Meteor.publish("presence", function() {
	return presence.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
});