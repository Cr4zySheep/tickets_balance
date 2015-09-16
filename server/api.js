Router.route('/achats', function() {
	var body = this.request.body;
	var key = body.key; //API key
	var type = body.type; //Tickets ou abonnements
	var email = body.email; //Email de l'acheteur
	var amount = body.amount; //Nombre acheté

	if(!key || key !== "your_key") {
        console.log('Access denied');
        this.response.end();
        return;
    }

    if(!email) {
        console.log('An error happened !');
        this.response.end();
        return;
    }

    if(!amount) {
        console.log('An error happened !');
        this.response.end();
        return;
    }

    if(!type) {
        console.log('An error happened !');
        this.response.end();
        return;
    }

    if(type !== 'tickets' && type !== 'abo') {
        console.log('An error happened !');
        this.response.end();
        return;
    }

    var methodName = 'buyAbo';
    if (type === 'tickets') {
        methodName = 'buyTickets';
    }
    Meteor.call(methodName, email, amount);
    console.log(email + ' bought ' + amount + ' ' + type + '.');
    this.response.end();

}, {where: 'server'});

Router.route('/presence', function() {
	var body = this.request.body;
	var key = body.key; //API key
	var email = body.email; //email de la personne

	if(key && key === "your_key")
	{
		if(email) {
            Meteor.call('addPresence', email);
        }
		else {
            console.log('A mistake happened !');
        }
	} else {
        console.log('Acces refused');
    }

    this.response.end();
}, {where: 'server'});
