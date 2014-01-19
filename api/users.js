var couchbase = require('couchbase');

exports.init = function(app){

	// getting the client instance from the application
	var couchbaseClient = app.get('couchbaseClient');

	// the login API
	app.post('/api/login', function(req, res){
		var key = "user-" + req.body.username;
		couchbaseClient.get(key, getUserCallback);

		function getUserCallback(error, result) {
			var data = {};
			var status = 200; // HTTP status: OK.

			if(error) {
				if(error.code == couchbase.errors.keyNotFound) {
					status = 404; // HTTP status: Resource not found.
					data = {error: "User does not exist."};
				}
				else 
					status = 500; // HTTP status: Internal Server Error.
			} 
			else {
				if (result.value.password !== req.body.password) {
					status = 401; // HTTP status: Unauthorized.
					data = {error: "Invalid username or password."};
				} 
				else {	
					console.log(JSON.stringify(result));
					data = {
						isLoggedIn: true,
						name: result.value.username
					};	

					req.session.userData = data;
				}			
			}

			res.json(status, data);
		}
	});


    // the register API
    app.post('/api/register', function(req, res) {

    	var user = {
    		type: "user",
    		username: req.body.username,
    		email: req.body.email,
    		password: req.body.password,
    		shortDesc: req.body.description,
    		imageUrl: req.body.image
    	};

		// add the new user to the database
		couchbaseClient.add("user-" + user.username, user, addUserCallback);
		
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

    app.get('/api/users/follow/:uname', function (req, res) {

    	if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json({error: "Not logged in."});
	    	return;
	    }

	    var followKey = "user-" + req.params.uname;
	    var followerKey = "user-" + req.session.userData.name;
    	var data = {};
		var status = 200; // HTTP status: OK.
	    console.log(followKey, followerKey);

	    couchbaseClient.touch(followKey, userExistsCallback);

	    function userExistsCallback(error, result) {
			if(error) {
				if(error.code == couchbase.errors.keyNotFound) {
					status = 404; // HTTP status: Resource not found.
					data = {error: "User does not exist."};
				}
				else 
					status = 500; // HTTP status: Internal Server Error.

				res.json(status, data);
			} 
			else {
				AppendFollowerToUser(followKey, followerKey, appendFollowerCallback);
			}
		}

		function appendFollowerCallback(status, data) {
			res.json(status, data);
		}
	});
};

function AppendFollowerToUser(followKey, followerKey, appendFollowerCallback) {
	appendFollowerCallback(407, {error: "bla"});
}