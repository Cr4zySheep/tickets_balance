Template.solde.helpers({
	ticketsRest: function() {
    	return calcSolde();
	}
});

function calcSolde() {
	var list = _.pluck(purchase.find({type: 'tickets'}).fetch(), 'tickets');
    var purchased_tickets = _.reduce(list, function(memo, num){
        return memo + parseInt(num);
    }, 0);

	var used_tickets = _.reduce(_.pluck(presence.find({}).fetch(), 'createdAt'), function(memo, date) {
		var abonnements = purchase.find({type: 'abo'}).fetch();
		for(var i in abonnements) {
			var abo = abonnements[i];
			var end_abo = moment(abo.createdAt, "YYYY MM DD").add(1, 'months').format("YYYY MM DD");
			if(abo.createdAt <= date && date < end_abo) return memo;
		}
		return memo + 1;
	}, 0);

	return purchased_tickets - used_tickets;
}