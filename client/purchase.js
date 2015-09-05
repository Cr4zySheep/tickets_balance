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

Template.purchaseList.events({
  "click #buyTickets": function(event) {
    Meteor.call("buyTickets", 5);
    return false;
  },
  "click #buySubs": function(event) {
    Meteor.call("buyAbo", 1);
    return false;
  }
});