var Meteor = this.Meteor;
var moment = this.moment;
var _ = this._;

function actualiseUsername(userId) {
  var user = Meteor.users.findOne(userId);

  var name = user && user.profile && user.profile.name;
  var surname = user && user.profile && user.profile.surname;

  if(!name) name='';
  if(!surname) surname='';

  Accounts.setUsername(userId, surname + ' '  + name);
}

//Free = no one use the same address (true if interested)
function isMacAddress(MAC, free) {
  var isCorrect = MAC.match('^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$');

  if(free) {
    return !Meteor.users.findOne({'profile.MACS.address': MAC}) && isCorrect;
  }
  return isCorrect;
}

Meteor.methods({

    //TODO only for logged user or admin
    editAboStart: function(userId, purchaseDate, aboStart, newAboStart) {
        var user = Meteor.user();
        if (Meteor.isAdmin(user._id)) {
            if (moment(aboStart, 'YYYY-MM-DD').isValid()) {
                var abos = Meteor.users.findOne(userId).profile.abos;
                _.findWhere(abos, {purchaseDate: purchaseDate, aboStart: aboStart}).aboStart = newAboStart;

                Meteor.users.update(userId, {$set: {'profile.abos': abos}});
            }
        }
    },

    merge: function(userIds) {
        var user = Meteor.user();
        if (Meteor.isAdmin(user._id)) {
            var users = Meteor.users.find({_id: {$in: userIds}}).fetch();

            Meteor.users.remove({_id: {$in: _.tail(userIds)}});
            Meteor.users.update(
                _.first(userIds),
                {
                    $set: {
                        'profile.presences': _.extend.apply(
                            this,
                            [{}].concat(
                                _.map(users, function(user) {
                                    return user.profile.presences;
                                })
                            )
                        ),
                        'profile.memberships': [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.profile.memberships;
                            })
                        ),
                        'profile.tickets': [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.profile.tickets;
                            })
                        ),
                        'profile.abos': [].concat.apply([],
                            _.map(users, function(user) {
                                return user.profile.abos;
                            })
                        ),
                        emails: [].concat.apply(
                            [],
                            _.map(users, function(user) {
                                return user.emails;
                            })
                        ),
                    }
                }
            );
        }
    },

    addNewEmail: function(userId, email) {
      if(!Meteor.isAdmin(Meteor.userId())) return;
      Accounts.addEmail(userId, email);
    },

    editEmail: function(userId, oldEmail, newEmail) {
      if(!Meteor.isAdmin(Meteor.userId())) return;
      if(Meteor.users.findOne(userId).emails.length > 1 || newEmail) {
        Accounts.removeEmail(userId, oldEmail);
      }
      Accounts.addEmail(userId, newEmail);
    },

    editSurname: function(userId, surname) {
      if(!Meteor.isAdmin(Meteor.userId())) return;
      Meteor.users.update(userId, {$set: {'profile.surname': surname}});
      actualiseUsername(userId);
    },

    editName: function(userId, name) {
      if(!Meteor.isAdmin(Meteor.userId())) return;
      Meteor.users.update(userId, {$set: {'profile.name': name}});
      actualiseUsername(userId);
    },

    addMAC: function(userId, MAC) {
      if(!Meteor.isAdmin(Meteor.userId()) || !isMacAddress(MAC, true)) return;
      Meteor.users.update(userId, {$push: {'profile.MACS': {'address': MAC}}});
    },

    editMAC: function(userId, oldMAC, newMAC) {
      if(!Meteor.isAdmin(Meteor.userId()) || !isMacAddress(oldMAC) || (!isMacAddress(newMAC, true) && newMAC != '')) return;
      if(newMAC && newMAC != '') {
          Meteor.users.update({_id: userId, 'profile.MACS.address': oldMAC}, {$set: {'profile.MACS.$.address': newMAC}});
      } else {
          Meteor.users.update({_id: userId, 'profile.MACS.address': oldMAC},
                              {$pull: {'profile.MACS': {address: oldMAC}}});
      }
    }

});
