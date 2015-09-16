Router.route('/achats', function() {
	var body = this.request.body;
	var key = body.key; //API key
	var type = body.type; //Tickets ou abonnements
	var email = body.email; //Email de l'acheteur
	var amount = body.amount; //Nombre acheté

	if(key && key === "your_key")
	{
		if(email && amount) {
            if(type === "tickets") {
                console.log(email + ' bought ' + amount + ' tickets.');
                Meteor.call('buyTickets', email, amount);
            } else if(type === "abo") {
                console.log(email + ' bought ' + amount + ' abo.');
                Meteor.call('buyAbo', email, amount);
            } else {
                console.log('An error hapenned !');
            }
        }
	} else {
        console.log('Access denied');
    }

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
