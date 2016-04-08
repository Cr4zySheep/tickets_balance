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

Template.details.events({
  'click a': function(event, template) {
    event.preventDefault();
    Session.set('selectedUserId', undefined);
  }
})

Template.editProfil.helpers({
  emails: function() {
    var user = Session.get('selectedUser');
    return user && user.emails;
  },
  MACS: function() {
      var user = Session.get('selectedUser');
      return user && user.profile && user.profile.MACS;
    },
  surname: function() {
    var user = Session.get('selectedUser');
    return user && user.profile && user.profile.surname;
  },
  name: function() {
    var user = Session.get('selectedUser');
    return user && user.profile && user.profile.name;
  },
  username: function() {
    return Session.get('selectedUser').username;
  },
  isAdmin: function() {
    return Meteor.isAdmin(Meteor.userId());
  }
});

Template.editProfil.events({
  'submit': function(event, template) {
    event.preventDefault(); //No refresh

    if(event.target.name == 'add-email') {
      console.log('Add an email');
      Meteor.call('addNewEmail', Session.get('selectedUserId'), event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }

    if(event.target.name == 'edit-email') {
      console.log('Edit an email');
      Meteor.call('editEmail', Session.get('selectedUserId'), event.target[0].name, event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }

    if(event.target.name == 'edit-surname') {
      console.log('Edit surname');
      Meteor.call('editSurname', Session.get('selectedUserId'), event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }

    if(event.target.name == 'edit-name') {
      console.log('Edit name');
      Meteor.call('editName', Session.get('selectedUserId'), event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }

    if(event.target.name == 'add-mac') {
      console.log('Add mac address');
      Meteor.call('addMAC', Session.get('selectedUserId'), event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }

    if(event.target.name == 'edit-mac') {
      console.log('Edit mac address');
      Meteor.call('editMAC', Session.get('selectedUserId'), event.target[0].name, event.target[0].value, function(err, result) {
        if(err) console.log(err.reason);
      });
    }
  }
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
