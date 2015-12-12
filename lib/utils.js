var _ = this._;
var moment = this.moment;

//TODO move to our namespace
function computeBalance(user) {
	var memberships = user.profile.memberships.length;

    var purchasedTickets = _.reduce(user.profile.tickets, function(memo, purchase){
        return memo + purchase.tickets;
    }, 0);

	var usedTickets = _.reduce(
        user.profile.presences,
        function(memo, amount, date) {
            var presenceMoment = moment(date);
            var oneMonthBefore = presenceMoment.clone().subtract(1, 'month');
            var isDuringAbo = _.some(user.profile.abos, function(purchase){
                return oneMonthBefore.format('YYYY-MM-DD') < purchase.aboStart &&
                    purchase.aboStart <= presenceMoment.format('YYYY-MM-DD');
            });
            if (isDuringAbo) { return memo; }
            return memo + amount;
        },
    0);

    // The first ticket is free
	return 1 + memberships + purchasedTickets - usedTickets;
}

this.computeBalance = computeBalance;
