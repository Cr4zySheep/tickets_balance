var moment = this.moment;
var Router = this.Router;
var Meteor = this.Meteor;
var Mongo = this.Mongo;
var _ = this._;

Router.route('/achats', function() {
	var body = this.request.body;
	var key = body.key; //API key
	var type = body.type; //Tickets ou abonnements
	var email = body.email; //Email de l'acheteur
	var amount = body.amount; //Nombre acheté

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

    if(!type) {
        this.response.writeHead(404);
        this.response.end("Missing purchase type.\n");
        return;
    }

    if(type !== 'tickets' && type !== 'abo') {
        this.response.writeHead(404);
        this.response.end("Unexpected purchase type.\n");
        return;
    }

    var methodName = 'buyAbo';
    if (type === 'tickets') {
        methodName = 'buyTickets';
    }

    Meteor.call(methodName, email, amount);
    console.log(email + ' bought ' + amount + ' ' + type + '.');
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

    //TODO error callback
    Meteor.call('addPresence', email, date, amount);
    this.response.writeHead(200);
    this.response.end("OK\n");

}, {where: 'server'});
