
exports.init = function(app){

	// getting the client instance from the application
	var cbClient = app.get('cbClient');

	// the login API
	app.post('/api/login', function(req, res){
		
		// trying to get the user's document using the username as key
		cbClient.get(req.body.username, function(err, result){
			
			if(err ||
			   result.value.password !== req.body.password){

				res.writeHead(401);
				res.end();
			}else{	
				data = {
						isLoggedIn: true,
						name: result.value.username
						};	

				res.json(data);
			}
					
		});
		
	});
};