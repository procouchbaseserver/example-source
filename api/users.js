
exports.init = function(app){

	// getting the client instance from the application
	var couchbaseClient = app.get('couchbaseClient');

	// the login API
	app.post('/api/login', function(req, res){
		
		// trying to get the user's document using the username as key
		couchbaseClient.get(req.body.username, function(err, result){
			
			if(err ||
			   result.value.password !== req.body.password){

				res.writeHead(401);
				res.end();
			}else{	
				console.log(JSON.stringify(result));
				data = {
						isLoggedIn: true,
						name: result.value.username
						};	

				req.session.userData = data;
				res.json(data);
			}
					
		});
		
	});

    // the register API
	app.post('/api/register', function(req, res){
		
		var user = {
			type: "user",
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			shortDesc: req.body.description,
			imageUrl: req.body.image
		};

		// add the new user to the database
		couchbaseClient.add(user.username, user, addUserCallback);
		
		function addUserCallback(err, result) {
			
			if(err) {
				console.log(err);

				if(err.code == couchbase.errors.keyAlreadyExists) {
					res.writeHead(409); // HTTP status: Conflict
					res.json({error: "User already exists."});
					res.end();
				}
				else {
					res.writeHead(500); // HTTP status: Internal Server Error
					res.end();
				}
			}
            else {	
				data = {
						isLoggedIn: true,
						name: user.username
						};	

				req.session.userData = data;
				res.json(data);
			}
					
		}
	});
};