
exports.init = function(app){

	// the login API
	app.post('/api/login', function(req, res){
		console.log('got login data');
		res.json({name: 'Yaniv Rodenski', isLoggedIn: true});
	});
};