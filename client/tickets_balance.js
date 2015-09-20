var Meteor = this.Meteor;
var Template = this.Template;
var purchase = this.purchase;
var presence = this.presence;
var _ = this._;
var moment = this.moment;
var Pikaday = this.Pikaday;
var document = this.document;

function computeBalance() {
	var memberships = purchase.find({membershipStart:{$exists: true}}).count();

	var tickets = _.pluck(purchase.find({tickets:{$exists: true}}).fetch(), 'tickets');

    var purchasedTickets = _.reduce(tickets, function(memo, amount){
        return memo + amount;
    }, 0);

	var usedTickets = _.reduce(
        presence.find().fetch(),
        function(memo, presence) {
            var presenceMoment = moment(presence.date);
            var oneMonthBefore = presenceMoment.clone().subtract(1, 'month');
            var coveringAbos = purchase.find({
                aboStart: {
                    $gt: oneMonthBefore.format('YYYY-MM-DD'),
                    $lte: presenceMoment.format('YYYY-MM-DD'),
                },
            });
            if (coveringAbos.count() > 0) {
                return memo;
            }
            return memo + presence.amount;
        },
        0);

    // The first ticket is free
	return 1 + memberships + purchasedTickets - usedTickets;
}

Template.home.onCreated(function(){
    this.subscribe("purchase");
    this.subscribe("presence");
});

Template.balance.helpers({
	remainingTickets: computeBalance,
});

Template.presences.helpers({
	presences: function() {
 		return presence.find({}, {
            sort: {
                date: 1,
            },
        });
	},
});

Template.purchases.helpers({
 	purchases: function() {
 		return purchase.find({}, {
            sort: {
                purchaseDate: 1,
            },
        });
 	},
});

Template.purchase.onRendered(function() {
    if (this.data.aboStart) {
        var id = this.data._id;
        _.defer(function() {
            new Pikaday({
                field: document.getElementById(id),
                firstDay: 1,
                format: 'YYYY-MM-DD',
            });
        });
    }
});

Template.purchase.events({
	'submit form': function(event) {
		event.preventDefault();
		var date = event.currentTarget.startedDate.value;
        Meteor.call('editAboStart', this._id, date);
	}
});
