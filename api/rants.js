var couchbase = require('couchbase'),
	_ = require('underscore');

exports.init = function(app){

	// getting the client instance from the application
	var connection = app.get('couchbaseClient');
	
	// Retrieve a list of rants on your wall
	app.get('/api/rants', function(req, res) {

		if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json(401, {error: "Not logged in."});
	    	return;
	    }

		//res.json({})

	}); 

	app.get('/api/rants/about/:username', function (req, res) {
		connection.view('rants','rantabouts_by_original_ranter')
		.query({limit: 10, key: req.params.username}, function (error, results){
			if(error){
				console.log(error);
				res.writeHead(500);
				res.end();
			} else {
				getRants(results,res);
				}
		});
	});


	// Post a new rant
	app.post('/api/rants/', function (req, res) {
		console.log(req.body);

		var rant = req.body;
		rant.date = new Date();

		var userkey = rant.userName.toLowerCase() + '-rant';
		connection.incr(userkey, {initial: 1, offset: 1}, function(err, result) {

			connection.add(userkey + '-' + result.value, rant, function (err, result){
					if(err){
						res.writeHead(500);
						res.end();
					} else {
					res.json(result.value);
					}
				});
		});
	});
};

function getRants (results, res){

	// retrive the id property from each object in 
	// the results collection
	var ids = _.pluck(results, 'id');

	connection.getMulti(ids, {}, function(err, results) {
		if(err){
			res.writeHead(500);
			res.end();
		} else {
			var rants = _.pluck(rants, 'value');		
			res.json(rants); // write the rants array to the server response
		}
	});

	// Delete a rant
	app.delete('/api/rants/:id', function(req, res) {
		if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json(401, {error: "Not logged in."});
	    	return;
	    }

		var rantKey = req.session.userData.name + "-rant-" + req.params.id;
		couchbaseClient.remove(rantKey, removeCallback);

		function removeCallback(error, result) {
			var data = {};
			var status = 200; // HTTP status: OK.

			if(error) {
				if(error.code == couchbase.errors.keyNotFound) {
					status = 404; // HTTP status: Resource not found.
					data = {error: "Rant does not exist."};
				}
				else 
					status = 500; // HTTP status: Internal Server Error.
			}		

			res.json(status, data);
		}
	});
}