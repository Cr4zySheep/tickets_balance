Meteor.subscribe("purchase");

Template.purchaseList.helpers({
 	getPurchase: function() {
 		return purchase.find({}, {sort: {createdAt: -1}});
 	},
 	purchaseCount: function() {
 		return purchase.find({}).count();
 	},
  ticketsCount: function() {
    var list = _.pluck(purchase.find({owner: Meteor.userId(), tickets: {$gt: 0}}).fetch(), 'tickets');
    var tickets = _.reduce(list, function(memo, num){
        return memo + num;
    }, 0);
    return tickets;
  }
});

Template.aboList.helpers({
	getAbo: function() {
		return purchase.find({type: 'abo'}, {sort: {createdAt: -1}});
	},
	aboCount: function() {
		return purchase.find({type: 'abo'}).count();
	}
});

Template.abo.onRendered(function() {
	var list = document.getElementsByClassName('datepicker');
	if(list) for(var i = 0; i < list.length; i++) {
		var picker = new Pikaday({
			field: list[i],
			minDate: moment().toDate()
		});
	}
});

Template.abo.events({
	'submit .abo': function(event) {
		event.preventDefault();
		var date = event.target.startedDate.value;
		if(!date) return;
		var day = moment(date, 'YYYY-MM-DD');
		if(moment().isBefore(day, 'day') || moment().isSame(day, 'day')) Meteor.call('startAbo', this._id, day);
	}
});

Template.abo.helpers({
	'startedDate': function() {
		return this.startedAt.format('DD/MM/YYYY');
	},
	'finishedDate': function() {
		return this.startedAt.add(1, 'M').format('DD/MM/YYYY');
	},
	'createdDate': function() {
		return moment(this.createdAt, 'YYYY-MM-DD-hh-mm').format('DD/MM/YYYY');
	}
});