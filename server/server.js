//Only on the server
//Contains all the purchase
Meteor.publish("purchase", function() {
  	return purchase.find({owner: this.userId});
});

Meteor.publish("presence", function() {
	return presence.find({owner: this.userId});
});

Meteor.methods({
 	buyTickets: function(nbr) {
     	if(!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }
        console.log(nbr);
        purchase.insert({
          createdAt: moment().format("YYYY MM DD hh mm ss"),
          owner: Meteor.userId(),
          tickets: nbr
        });
    },
    buyAbo: function(nbr) {
    	if(!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }

        _.each(_.range(nbr), function() {
        	purchase.insert({
        		createdAt: moment().format("YYYY MM DD hh mm ss"),
        		owner: Meteor.userId(),
        		type: 'abo'
        	});
        });
    },
    addPresence: function(who) {
    	var date = moment().format("YYYY MM DD hh mm ss");
    	if(presence.find({createdAt: date}).count() == 0)
    	{
    		presence.insert({
	    		owner: who,
	    		createdAt: moment().format("YYYY MM DD hh mm ss")
	    	});
    	}
    },
    reset: function() {
    	presence.remove({});
    	purchase.remove({});
    }
});