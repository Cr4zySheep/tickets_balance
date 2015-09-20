var moment = this.moment;
var Router = this.Router;
var Meteor = this.Meteor;
var Mongo = this.Mongo;
var Accounts = this.Accounts;
var purchase = this.purchase;
var presence = this.presence;
var _ = this._;

function getOrCreateUserId(email) {
    var user = Meteor.users.findOne({
        'emails': {
            $elemMatch: {
                address: email,
            },
        },
    });

    if (user) {
        return user._id;
    }

    return Accounts.createUser({
        email: email,
    });
}

//TODO error callbacks

Router.route('/membership', function() {
	var body = this.request.body;
	var key = body.key;
	var email = body.email;
	var purchaseDate = body.purchaseDate;

	if(!key || key !== Meteor.settings.purchaseApiSecret) {
        this.response.writeHead(403);
        this.response.end("Invalid API key.\n");
        return;
    }

    if(!email) {
        this.response.writeHead(404);
        this.response.end("Missing email address.\n");
        return;
    }

    var purchaseMoment;
    if(!purchaseDate) {
        purchaseMoment = moment();
    } else {
        purchaseMoment = moment(purchaseDate);
    }
    if(!purchaseMoment.isValid()) {
        this.response.writeHead(404);
        this.response.end("Invalid purchase date.\n");
        return;
    }

    purchase.insert({
        purchaseDate: purchaseMoment.format('YYYY-MM-DD'),
        userId: getOrCreateUserId(email),
        membershipStart: purchaseDate,
    });
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});

Router.route('/tickets', function() {
	var body = this.request.body;
	var key = body.key;
	var email = body.email;
	var purchaseDate = body.purchaseDate;
	var amount = body.amount;

	if(!key || key !== Meteor.settings.purchaseApiSecret) {
        this.response.writeHead(403);
        this.response.end("Invalid API key.\n");
        return;
    }

    if(!email) {
        this.response.writeHead(404);
        this.response.end("Missing email address.\n");
        return;
    }

    if(!amount) {
        this.response.writeHead(404);
        this.response.end("Missing amount.\n");
        return;
    }

    amount = parseInt(amount, 10);
    if(_.isNaN(amount)) {
        this.response.writeHead(404);
        this.response.end("Invalid amount"+amount+".\n");
        return;
    }

    var purchaseMoment;
    if(!purchaseDate) {
        purchaseMoment = moment();
    } else {
        purchaseMoment = moment(purchaseDate);
    }
    if(!purchaseMoment.isValid()) {
        this.response.writeHead(404);
        this.response.end("Invalid purchase date.\n");
        return;
    }

    purchase.insert({
        purchaseDate: purchaseMoment.format('YYYY-MM-DD'),
        userId: getOrCreateUserId(email),
        tickets: amount,
    });
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});

Router.route('/abos', function() {
	var body = this.request.body;
	var key = body.key;
	var email = body.email;
	var purchaseDate = body.purchaseDate;
	var startDate = body.startDate;
	var amount = body.amount;

	if(!key || key !== Meteor.settings.purchaseApiSecret) {
        this.response.writeHead(403);
        this.response.end("Invalid API key.\n");
        return;
    }

    if(!email) {
        this.response.writeHead(404);
        this.response.end("Missing email address.\n");
        return;
    }

    var purchaseMoment;
    if(!purchaseDate) {
        purchaseMoment = moment();
    } else {
        purchaseMoment = moment(purchaseDate);
    }
    if(!purchaseMoment.isValid()) {
        this.response.writeHead(404);
        this.response.end("Invalid purchase date.\n");
        return;
    }

    var startMoment;
    if(!startDate) {
        startMoment = moment();
    } else {
        startMoment = moment(startDate);
    }
    if(!startMoment.isValid()) {
        this.response.writeHead(404);
        this.response.end("Invalid start date.\n");
        return;
    }

    if(!amount) {
        amount = '1';
    }

    amount = parseInt(amount, 10);
    if(_.isNaN(amount)) {
        this.response.writeHead(404);
        this.response.end("Invalid amount"+amount+".\n");
        return;
    }

    var i;
    for (i=0; i<amount; i++) {
        purchase.insert({
            purchaseDate: purchaseMoment.format('YYYY-MM-DD'),
            userId: getOrCreateUserId(email),
            aboStart: startMoment.format('YYYY-MM-DD'),
        });
        startMoment.add(1, 'month');
    }
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});

Router.route('/presence', function() {
	var body = this.request.body;
	var key = body.key; //API key
	var email = body.email; //email de la personne
	var date = body.date; //date de la présence
	var amount = body.amount; //1.0 or 0.5

	if(!key || key !== Meteor.settings.presenceApiSecret) {
        this.response.writeHead(403);
        this.response.end("Invalid API key.\n");
        return;
    }

    if(!email) {
        this.response.writeHead(404);
        this.response.end("Missing email address.\n");
        return;
    }

    var momentDate;
    if(!date) {
        momentDate = moment();
    } else {
        momentDate = moment(date);
    }
    if(!momentDate.isValid()) {
        this.response.writeHead(404);
        this.response.end("Invalid date.\n");
        return;
    }

    date = momentDate.format('YYYY-MM-DD');

    if(!amount) {
        amount = '1.0';
    }

    amount = parseFloat(amount);
    if(_.isNaN(amount)) {
        this.response.writeHead(404);
        this.response.end("Invalid amount"+amount+".\n");
        return;
    }

    var userId = getOrCreateUserId(email);

    presence.upsert({
        userId: userId,
        date: date,
    },{
        userId: userId,
        date: date,
        amount: amount,
    });
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});
