//Only on the server
//Contains all the purchase
Meteor.publish("purchase", function() {
  	return purchase.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
});

Meteor.publish("presence", function() {
	return presence.find({owner: Meteor.users.findOne(this.userId).emails[0].address});
});

Meteor.methods({
 	buyTickets: function(owner, nbr) {
        purchase.insert({
          createdAt: moment().format("YYYY MM DD hh mm"),
          owner: owner,
          tickets: nbr,
          type: 'tickets'
        });
    },
    buyAbo: function(owner, nbr) {
        _.each(_.range(nbr), function() {
        	purchase.insert({
        		createdAt: moment().format("YYYY MM DD hh mm"),
        		owner: owner,
        		type: 'abo'
        	});
        });
    },
    addPresence: function(who) {
    	var date = moment().format("YYYY MM DD");
    	if(presence.find({createdAt: date}).count() == 0)
    	{
    		presence.insert({
	    		owner: who,
	    		createdAt: moment().format("YYYY MM DD")
	    	});
    	}
    }
});