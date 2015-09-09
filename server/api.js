Router.route('/achats', function() {
	body = this.request.body;
	var key = body.key; //API key
	var type = body.type; //Tickets ou abonnements
	var email = body.email; //Email de l'acheteur
	var amount = body.amount; //Nombre acheté

	if(key && key =="write_your_key_here")
	{
		if(email && amount) if(type == "tickets") {
			console.log(email + ' bought ' + amount + ' tickets.');
			Meteor.call('buyTickets', email, amount);
		} else if(type == "abo") {
			console.log(email + ' bought ' + amount + ' abo.');
			Meteor.call('buyAbo', email, amount);
		} else console.log('A mistake hapenned !');
	} else console.log('Acces refused')
}, {where: 'server'});

Router.route('/presence', function() {
	body = this.request.body;
	var key = body.key; //API key
	var email = body.email; //email de la personne

	if(key && key =="write_your_other_key_here") 
	{
		if(email) Meteor.call('addPresence', email);
		else console.log('A mistake happened !');
	} else console.log('Acces refused')
}, {where: 'server'});