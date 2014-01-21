var couchbase = require('couchbase'),
	uuid = require('uuid'),
	_ = require('underscore');

var levels = {"yearly":1, "monthly":2, "dayly":3};

exports.init = function(app){

	// getting the client instance from the application
	var connection = app.get('couchbaseClient');
	//http://localhost.:3000/api/rants?start=1-19-2014&end=1-20-2014
	
	// Retrieve a list of rants on your wall
	app.get('/api/rants', function(req, res) {

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

	// Retrieve a count of rants per-date (dayly|monthly|yearly)
	app.get('/api/rants/:level(dayly|monthly|yearly)/count', function(req, res) {

		console.log(levels[req.params.level]);
		console.log('----------');

		var view = connection.view('rants', 'per_date');
		view.query({ group_level:levels[req.params.level] }, function (error, results){
			if(error){
				console.log(error);
				res.writeHead(500);
				res.end();
			} else {
				console.log(results);
				console.log('----------');
				res.json(results);
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
		var rant = req.body;
		rant.date = new Date();
		rant.rantbacks = uuid.v4();

		var userKey = "rant-" + rant.userName;
		var counterKey = userKey + "-count";
		connection.incr(counterKey, {initial: 1, offset: 1}, incrementCallback);

		function incrementCallback(error, result) {
			if(error) {
				res.writeHead(500);
				res.end();
			}
			else {
				var documents = {};
				var rantKey = userKey + '-' + result.value;
				var rantbacksKey = rant.rantbacks;
				documents[rantKey] = { value: rant };
				documents[rantbacksKey] = { value : [] };
				connection.setMulti(documents, {}, setMultiCallback);
			}
		}

		function setMultiCallback(error, result) {
			if(error){
				res.writeHead(500); // HTTP status: Internal Server Error.
				res.end();
			} else {
				res.json(201, rant); // HTTP status: Created.
			}
		};
	});

	// Delete a rant
	app.delete('/api/rants/:id', function(req, res) {
		if( !req.session.userData ||
    		!req.session.userData.isLoggedIn ||
    		!req.session.userData.name) { 
    		res.json(401, {error: "Not logged in."});
	    	return;
	    }

		var rantKey = "rant-" + req.session.userData.name + req.params.id;
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

