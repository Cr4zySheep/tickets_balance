Meteor.subscribe('presence');
Template.presenceTab.helpers({
	getPresence: function() {
		return presence.find({}, {sort: {createdAt: -1}});
	},
	presenceCount: function() {
		return presence.find({}).count();
	}
});