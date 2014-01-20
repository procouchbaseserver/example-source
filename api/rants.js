var couchbase = require('couchbase'),
	uuid = require('uuid'),
	_ = require('underscore');

exports.init = function(app){

	// getting the client instance from the application
	var connection = app.get('couchbaseClient');
	//http://localhost.:3000/api/rants?start=19-1-2014&end=20-1-2014
	
	// Retrieve a list of rants on your wall
	app.get('/api/rants', function(req, res) {

		// if( !req.session.userData ||
		// 	!req.session.userData.isLoggedIn ||
		// 	!req.session.userData.name) { 
		// 	res.json(401, {error: "Not logged in."});
		// 	return;
		// }
		//res.json({})

		var startDate = new Date(req.query.start);
		var endDate = new Date(req.query.end);

		var view = connection.view('rants', 'by_date');
		view.query({startkey: startDate, endkey: endDate}, function (error, results){
			if(error){
				console.log(error);
				res.writeHead(500);
				res.end();
			} else {
				getRants(results,res);
			}
		});
	}); 

	app.get('/api/rants/about/:username', function (req, res) {
		connection.view('rants', 'rantabouts_by_original_ranter')
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
	app.post('/api/rants', function (req, res) {
		console.log(req.body);

		var rant = req.body;
		rant.date = new Date();
		rant.rantbacks = uuid.v4();

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

	function getRants (results, res){

		// retrive the id property from each object in 
		// the results collection
		var ids = _.pluck(results, 'id');

		connection.getMulti(ids, {}, function(err, results) {
			if(err){
				console.log(err.error);
				res.writeHead(500);
				res.end();
			} else {
				var rants = _.pluck(results, 'value');	
				console.log(rants)	
				res.json(rants); // write the rants array to the server response
			}
		});

	}
};

