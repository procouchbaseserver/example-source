var express   = require('express'),
	http      = require('http'),
	path      = require('path'),
	couchbase = require('couchbase');

// api modules
var users = require('./api/users.js');

var app = module.exports = express();
var port = process.env.PORT || 3000;

var cbClient = new couchbase.Connection({
  'bucket':'ranter',
  'host':'127.0.0.1:8091'
});

// all environments
app.set('cbClient', cbClient);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/bootstrap/css', express.static(__dirname + '/bootstrap/css'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '511ee622c371462aa9067dc3b40ebe45'}));
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

// setting up the api modules
users.init(app);

http.createServer(app).listen(port, function () {
	console.log('Express server listening on port ' + port);
});