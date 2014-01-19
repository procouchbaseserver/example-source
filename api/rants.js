var couchbase = require('couchbase');

exports.init = function(app){

	// getting the client instance from the application
	var couchbaseClient = app.get('couchbaseClient');
	
	// Retrieve a list of rants on your wall
	app.get('/api/rants', function(req, res) {

		if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json({error: "Not logged in."});
	    	return;
	    }

		//res.json({})

	}); 

	app.get('/api/rants/about/:username', function (req, res) {
		couchbaseClient.view('rants','rantabouts_by_original_ranter')
		.query({limit: 10, key: req.params.username}, function (error, results){
			if(error){
				console.log(error);
				res.writeHead(500);
				res.end();
			} else {
				var ids = [];
				for (var i = 0; i < results.length; ++i) {
					ids.push(results[i].id);
				}

				couchbaseClient.getMulti(ids, {}, function(err, results) {
					if(err){
						res.writeHead(500);
						res.end();
					} else {
						var rants = [];		
						for(var key in results) {
							var result = results[key];
							if(result.value) 
								rants.push(result.value);
						};
						res.json(rants); // write the rants array to the server response
					}
				});

			}
		});
	});


	// Post a new rant
	app.post('/api/rants/post', function(req, res) {

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
};