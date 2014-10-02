var http = require('http');

exports.get = function (connection, bucket, designDoc, view){

	// getting a random node in the cluster
	var node = connection.serverNodes[Math.floor(Math.random() * connection.serverNodes.length)];
	var viewUri = 'http://' + node + '/' + bucket + '/_design/' + designDoc + '/_spatial/' + view + '?bbox=';
	
	console.log(connection._cb);

	// this function can be used to qury the spatial view
	var view = {
		query: function (bbox, callback){

			http.get(viewUri + bbox, function(res){

				console.log(res);

			});
		}
	}

	return view;
};