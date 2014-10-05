var fs = require('fs');

exports.init = function(connection){

	var rants = fs.readFileSync("./utils/designDocs/rants.json");
	
	connection.setDesignDoc('rants', rants, function(err) {
		if(err) {
			console.log( 'ERROR' + err );
		} else {
			console.log( 'Updated ' );
		}
    });
};