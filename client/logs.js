var Template = this.Template;
var Meteor = this.Meteor;

Template.logs.onCreated(function(){
	this.subscribe('logs');
});

Template.logs.helpers({
	logs: function() {
		return Meteor.logs.find({}, {"sort" : [['createdAt', 'desc']]} );
	}
})