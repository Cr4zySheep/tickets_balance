var moment = this.moment;
var Router = this.Router;
var Meteor = this.Meteor;
var Accounts = this.Accounts;
var _ = this._;
var computeBalance = this.computeBalance;

function addLogMessage(msg) {
    Meteor.logs.insert({createdAt: new moment().format('DD/MM/YYYY - HH:mm:ss'), message: msg});
}

function getOrCreateUserId(email) {
    var user = Meteor.users.findOne({
        emails: {
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
        profile: {
            presences: {},
            memberships: [],
            abos: [],
            tickets: [],
        },
    });
}

function addTickets(userId, purchaseDate, amount) {
    Meteor.users.update(
        userId, {
            $push: {
                'profile.tickets': {
                    purchaseDate: purchaseDate,
                    tickets: amount,
                }
            }
        }
    );
    addLogMessage(userId+' bought '+amount+' tickets at '+purchaseDate);
}

function addMembership(userId, purchaseDate) {
    Meteor.users.update(
        userId, {
            $push: {
                'profile.memberships': {
                    purchaseDate: purchaseDate,
                    membershipStart: purchaseDate,
                }
            }
        }
    );
    addLogMessage(userId+' bought membership at '+purchaseDate);
}

function addAbos(userId, purchaseDate, startDate, amount) {
    var startMoment = moment(startDate);
    Meteor.users.update(
        userId, {
            $push: {
                'profile.abos': {
                    $each: _.map(_.range(amount), function (i) {
                        return {
                            purchaseDate: purchaseDate,
                            aboStart: startMoment.clone().add(i, 'months').format('YYYY-MM-DD'),
                        };
                    })
                }
            }
        }
    );
    addLogMessage(userId+' bought '+amount+' tickets at '+purchaseDate);
}

function addPresence(userId, presenceDate, amount) {
    var presenceEntry = {};
    presenceEntry['profile.presences.'+presenceDate] = amount;
    Meteor.users.update(userId, {$set: presenceEntry});
    addLogMessage(userId+' was present at '+presenceDate);
}

//TODO log every request
//TODO read the key from the header and do not process body if invalid
//TODO use POST for purchases, PUT for presences, GET for balance and backup

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

    addMembership(getOrCreateUserId(email), purchaseMoment.format('YYYY-MM-DD'));
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

    addTickets(getOrCreateUserId(email), purchaseMoment.format('YYYY-MM-DD'), amount);
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

    addAbos(
        getOrCreateUserId(email),
        purchaseMoment.format('YYYY-MM-DD'),
        startMoment.format('YYYY-MM-DD'),
        amount);
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

    addPresence(getOrCreateUserId(email), date, amount);
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});

Router.route('/wook', function() {
    //TODO check hash
    var order = this.request.body.order;

    if (order.status !== 'completed') {
        this.response.writeHead(200);
        this.response.end("Ignored\n");
        return;
    }

    var items = order.line_items;
    var purchaseDate = moment(order.completed_at).format('YYYY-MM-DD');
    var email = order.customer.email;

    items.map(function(item){
        var quantity = item.quantity;

        var userId = getOrCreateUserId(email);
        switch (item.product_id) {
            case 3021: //ticket
                addTickets(userId, purchaseDate, quantity);
                break;
            case 3022: //carnet
                addTickets(userId, purchaseDate, 10*quantity);
                break;
            case 3023: //abonnement
                var startDate = purchaseDate;
                var startDateMeta = _.first(_.where(item.meta, {label: 'Date de début'}));
                if (startDateMeta) {
                    startDate = moment(startDateMeta.value, "DD/MM/YYYY").format('YYYY-MM-DD');
                }
                addAbos(
                    userId,
                    purchaseDate,
                    startDate,
                    quantity);
                break;
            case 3063: //carte de membre
                addMembership(userId, purchaseDate, purchaseDate);
                break;
        }
    });

    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});

Router.route('/balance', function() {
	var body = this.request.body;
	var key = body.key;
	var email = body.email;

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

    var user = Meteor.users.findOne({
        'emails': {
            $elemMatch: {
                address: email,
            },
        },
    });

    if (!user) {
        this.response.writeHead(404);
        this.response.end("Invalid email address.\n");
        return;
    }

    var balance = computeBalance(user);
    addLogMessage('Someone asked for the balance of '+user._id);

    this.response.writeHead(200);
    this.response.end(balance.toString());
}, {where: 'server'});

// TODO: POST /membership to pay, GET /membership to compute validity
Router.route('/membershipExpiration', function() {
	var body = this.request.body;
	var key = body.key;
	var email = body.email;

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

    var user = Meteor.users.findOne({
        'emails': {
            $elemMatch: {
                address: email,
            },
        },
    });

    if (!user) {
        this.response.writeHead(404);
        this.response.end("Invalid email address.\n");
        return;
    }

    var expiration = 'Pas de cotisation à jour.';
    if (user.profile &&
        user.profile.memberships &&
        user.profile.memberships.length > 0) {
        var latestMembership = _.last(
            _.pluck(user.profile.memberships, 'membershipStart').sort()
        );
        var expirationMoment = moment(latestMembership).add(1, 'year');
        if (expirationMoment.isAfter()) {
            expiration = 'Cotisation à jour jusqu\'au '+
                expirationMoment.format('DD/MM/YYYY') + '.';
        }
    }

    addLogMessage('Someone asked for the membership expiration of '+user._id);
    this.response.writeHead(200);
    this.response.end(expiration);
}, {where: 'server'});

Router.route('/backup', function() {
	var key = this.request.body.key;
	if(!key || key !== Meteor.settings.presenceApiSecret) {
        this.response.writeHead(403);
        this.response.end("Invalid API key.\n");
        return;
    }

    addLogMessage('Someone asked for backup');
    this.response.writeHead(200);
    this.response.end(
        JSON.stringify({
            users: Meteor.users.find().fetch(),
        })
    );
}, {where: 'server'});

//TODO add an api endpoint to show the currently present users (and unknown mac addresses)
