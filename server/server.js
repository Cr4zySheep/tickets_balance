//Only on the server
//Contains all the purchase
Meteor.publish("purchase", function() {
  	if(this.userId) return purchase.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
    else return;
});

Meteor.publish("presence", function() {
	if(this.userId) return presence.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
  else return;
});