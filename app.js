var express   = require('express'),
	http      = require('http'),
	path      = require('path'),
	couchbase = require('couchbase')
	viewsSetup = require('./utils/viewsSetup.js')
	spatialView = require('./utils/spatialView.js');

// api modules
var users = require('./api/users.js');
var rants = require('./api/rants.js');

var app = module.exports = express();
var port = process.env.PORT || 3000;

var connection = new couchbase.Connection({
  'bucket':'ranter',
  'host':'127.0.0.1:8091'
});


viewsSetup.init(connection);
spatialView.get(connection, 'ranter', '', '');

// all environments
app.set('connection', connection);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/views'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '511ee622c371462aa9067dc3b40ebe45'}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.use('/', express.static(path.join(__dirname, '/client')));

// setting up the api modules
users.init(app);
rants.init(app);

http.createServer(app).listen(port, function () {
	console.log('Express server listening on port ' + port);
});