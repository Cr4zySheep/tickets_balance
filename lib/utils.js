var purchase = this.purchase;
var presence = this.presence;
var _ = this._;
var moment = this.moment;

function computeBalance(userId) {

	var memberships = purchase.find({
        userId: userId,
        membershipStart: {$exists: true}
    }).count();

	var tickets = _.pluck(
        purchase.find({
            userId: userId,
            tickets:{$exists: true}
        }).fetch(),
        'tickets'
    );

    var purchasedTickets = _.reduce(tickets, function(memo, amount){
        return memo + amount;
    }, 0);

	var usedTickets = _.reduce(
        presence.find({userId: userId}).fetch(),
        function(memo, presence) {
            var presenceMoment = moment(presence.date);
            var oneMonthBefore = presenceMoment.clone().subtract(1, 'month');
            var coveringAbos = purchase.find({
                userId: userId,
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

this.computeBalance = computeBalance;
