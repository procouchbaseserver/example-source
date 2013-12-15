var express = require('express'),
	http    = require('http'),
	path    = require('path');

var app = module.exports = express();
var port = process.env.PORT || 3000;

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/bootstrap/css', express.static(__dirname + '/bootstrap/css'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// setting up the index and view partials
app.get('/', function homeRout(req, res){
	res.render('index');
});

app.get('/partials/:name', function patialRouts(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
});

app.post('/api/login', function(req, res){
	console.log('got login data');
	res.json({name: 'Yaniv Rodenski', isLoggedIn: true});
})
http.createServer(app).listen(port, function () {
	console.log('Express server listening on port ' + port);
});