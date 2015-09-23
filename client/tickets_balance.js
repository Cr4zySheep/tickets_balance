var Meteor = this.Meteor;
var Template = this.Template;
var purchase = this.purchase;
var presence = this.presence;
var _ = this._;
var moment = this.moment;
var Pikaday = this.Pikaday;
var document = this.document;
var Session = this.Session;
var computeBalance = this.computeBalance;

Template.home.helpers({
    selectedUser: function() {
        return Session.get('selectedUser');
    },
});

Template.users.onCreated(function(){
    this.subscribe("allUsers");
});

Template.users.helpers({
	users: function() {
 		return Meteor.users.find();
	},
});

Template.user.events({
	'click a': function(event) {
		event.preventDefault();
        Session.set('selectedUser', Template.instance().data._id);
	}
});

Template.details.onCreated(function(){
    this.subscribe("purchase", Session.get('selectedUser'));
    this.subscribe("presence", Session.get('selectedUser'));
});

Template.balance.helpers({
	remainingTickets: function() {
        return computeBalance(Session.get('selectedUser'));
    }
});

Template.balance.events({
	'click a': function(event) {
		event.preventDefault();
        Session.set('selectedUser', undefined);
	}
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
