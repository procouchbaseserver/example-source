	var _ = require('underscore');

exports.init = function(app){

	// getting the client instance from the application
	var couchbaseClient = app.get('couchbaseClient');
	
	app.get('/api/rants/about/:uname', function (req, res){
		couchbaseClient.view('rants','rantabouts_by_original_ranter')
		.query({limit: 10, key: req.params.uname}, function (error, results){
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
					if(error){
						res.writeHead(500);
						res.end();
					} else {
						var rants = _.map(results, function (o) {
							return o.value;
						});
						res.json(rants);
					}
				});

			}
		});
	});
};