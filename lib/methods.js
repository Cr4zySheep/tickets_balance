var Meteor = this.Meteor;
var purchase = this.purchase;
var presence = this.presence;
var moment = this.moment;
var _ = this._;
var Accounts = this.Accounts;

Meteor.methods({
    buyTickets: function(owner, nbr) {
        purchase.insert({
            createdAt: moment().format("YYYY-MM-DD-hh-mm"),
            owner: owner,
            tickets: nbr,
            type: 'tickets'
        });
    },

    buyAbo: function(owner, nbr) {
        _.each(_.range(nbr), function() {
            purchase.insert({
                createdAt: moment().format("YYYY-MM-DD-hh-mm"),
                owner: owner,
                type: 'abo'
            });
        });
    },

    addPresence: function(email, date, amount) {
        //TODO check arguments
        var user = Meteor.users.findOne({
            'emails': {
                $elemMatch: {
                    address: email,
                },
            },
        });

        var userId;
        if (!user) {
            userId = Accounts.createUser({
                email: email,
            });
        } else {
            userId = user._id;
        }

        presence.upsert({
            userId: userId,
            date: date,
        },{
            userId: userId,
            date: date,
            amount: amount,
        });
    },

    startAbo: function(idAbo, date) {
      purchase.update({_id: idAbo}, {$set: {
          startedAt: date,
          hadStarted: true
        }});
    }
});