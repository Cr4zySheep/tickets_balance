var Meteor = this.Meteor;
var purchase = this.purchase;
var moment = this.moment;

Meteor.methods({
    //TODO only for logged user or admin
    editAboStart: function(idAbo, aboStart) {
        if (moment(aboStart, 'YYYY-MM-DD').isValid()) {
            purchase.update(idAbo, {
                $set: {
                    aboStart: aboStart,
                }
            });
        }
    }
});
