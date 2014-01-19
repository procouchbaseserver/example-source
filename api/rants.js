var couchbase = require('couchbase');

exports.init = function(app){

	// getting the client instance from the application
	var connection = app.get('couchbaseClient');
	
	// Retrieve a list of rants on your wall
	app.get('/api/rants/wall', function(req, res) {

		if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json({error: "Not logged in."});
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
				var ids = [];
				for (var i = 0; i < results.length; ++i) {
					ids.push(results[i].id);
				}

				connection.getMulti(ids, {}, function(err, results) {
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
};