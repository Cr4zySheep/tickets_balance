var Meteor = this.Meteor;
var Template = this.Template;
var _ = this._;
var moment = this.moment;
var Pikaday = this.Pikaday;
var document = this.document;
var Session = this.Session;
var computeBalance = this.computeBalance;

Template.home.onCreated(function(){
    this.subscribe("allUsers");
});

Template.home.helpers({
    selectedUser: function() {
        return Session.get('selectedUserId');
    },
});

Template.users.events({
    'click button': function(event, template) {
        var userIds = template.$('input:checked').map(
            function() {return this.id;}
        ).get();
        Meteor.call('merge', userIds);
    },
});

//TODO cache the balance ?
Template.users.helpers({
	users: function() {
 		return Meteor.users.find();
	},
});

Template.user.helpers({
    balance: function() {
        return computeBalance(Template.instance().data);
    },
});

this.Tracker.autorun(function() {
    Session.set(
        'selectedUser',
        Meteor.users.findOne(Session.get('selectedUserId'))
    );
});

Template.user.events({
	'click a': function(event, template) {
		event.preventDefault();
        Session.set('selectedUserId', template.data._id);
	},
});

//TODO show user's email on the details page
//TODO show a list of the user's mac address

Template.balance.helpers({
	remainingTickets: function() {
        return computeBalance(Session.get('selectedUser'));
    }
});

Template.balance.events({
	'click a': function(event) {
		event.preventDefault();
        Session.set('selectedUserId', undefined);
	}
});

Template.presences.helpers({
	presences: function() {
        return _.sortBy(
            _.pairs(Session.get('selectedUser').profile.presences),
            function(pair) {return pair[0];}
        );
	},
});

Template.purchases.helpers({
 	purchases: function() {
        var profile = Session.get('selectedUser').profile;
        return _.sortBy(
            [].concat(profile.memberships, profile.abos, profile.tickets),
            'purchaseDate');
 	},
});

Template.purchase.onRendered(function() {
    if (this.data.aboStart) {
        var id = this.data._id;
        _.defer(function() {
            new Pikaday({
                field: this.find('[name=startedDate]'),
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
        Meteor.call(
            'editAboStart',
            Session.get('selectedUserId'),
            this.purchaseDate,
            this.aboStart,
            date);
	}
});
