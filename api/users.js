var couchbase = require('couchbase');

exports.init = function(app){

	// getting the client instance from the application
	var couchbaseClient = app.get('couchbaseClient');

	// the login API
	app.post('/api/login/', function(req, res){
		var key = "user-" + req.body.username;
		couchbaseClient.get(key, getUserCallback);
		console.log(key);

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
    app.post('/api/register/', function(req, res) {

    	var user = {
    		type: "user",
    		username: req.body.username,
    		email: req.body.email,
    		password: req.body.password,
    		shortDesc: req.body.description,
    		imageUrl: req.body.image
    	};

		// add the new user to the database
		couchbaseClient.add("user-" + user.username, user, {persist_to: 1, replicate_to: 0}, addUserCallback);
		
		function addUserCallback(error, result) {
			console.log(error, result);
			var data = {};
			var status = 200; // HTTP status: OK.

			if(error) {
				if(error.code == couchbase.errors.keyAlreadyExists) {
					status = 409; // HTTP status: Conflict
					data = {error: "User already exists."};
				}
				else {
					status = 500; // HTTP status: Internal Server Error
				}
			}
			else {	
				data = {
					isLoggedIn: true,
					name: user.username
				};	

				req.session.userData = data;
			}

			res.json(data);
		}
	});

    app.get('/api/users/:action(follow|unfollow)/:username', function (req, res) {

    	if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json({error: "Not logged in."});
	    	return;
	    }

	    var follow = req.params.username;
	    var follower = req.session.userData.name;
	    var operation = req.params.action;
    	var data = {};
		var status = 200; // HTTP status: OK.
	    console.log(follow, follower);

	    couchbaseClient.touch("user-" + follow, userExistsCallback);

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
				updateFollower(follow, follower, operation, updateFollowerCallback);
			}
		}

		function updateFollowerCallback(error, result) {
			console.log(error, result);
			if(error)
				status = 500;
			else
				data = {
					isFollowing: operation == "follow" ? true : false,
					name: follow
				};

			res.json(status, data);
		}
	});

	function updateFollower(follow, follower, operation, updateFollowerCallback) {

		var key = "follow-" + follow;
		var value = (operation == "follow" ? "+" : "-") + follower;

		couchbaseClient.append(key, value, appendCallback);

		function appendCallback(error, result) {

			// 'Not stored' error means it's a first time append, 
			// so we need to add the key
			if( error &&
			    error.code == couchbase.errors.notStored &&
				operation == "follow") {
				   	couchbaseClient.add(key, value, updateFollowerCallback);
				}
			else
				updateFollowerCallback(error, result);
		}
	}
};

