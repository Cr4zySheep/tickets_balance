var Router = this.Router;

Router.route('/', function() {
	this.render('home');
});

Router.route('/members', function() {
	this.render('members');
});
