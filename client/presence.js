Meteor.subscribe('presence');

Template.body.events({
	"click #reset": function(event) {
		Meteor.call('reset');
		return false;
	}
});

Template.presenceTab.events({
	"click #addPresence": function(event) {
		Meteor.call('addPresence', Meteor.userId());
		return false;
	}
});

Template.presenceTab.helpers({
	getPresence: function() {
		return presence.find({}, {sort: {createdAt: -1}});
	},
	presenceCount: function() {
		return presence.find({}).count();
	}
});