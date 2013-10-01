
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// For routing
app.get('/', routes.index);
app.get('/screen', routes.screen);
app.get('/screen/*', routes.screenWithRoom);
app.get('/controller', routes.controller);
app.get('/controller/*', routes.controllerWithRoom);

var allowCrossDomain = function(req, res, next) {
    console.log('allowingCrossDomain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
	  
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
};
 
app.configure(function() {
    app.use(allowCrossDomain);
});

// Set http constants to allow infinite # of sockets
http.globalAgent.maxSockets = Infinity;

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var randomString = function(len) {
	return Math.random().toString(36).slice(2,len+2);
}


// Websockets stuff

var io = io.listen(server);
io.set('log level', 2);

io.sockets.on('connection', function(socket) {
	var room = 'lobby';
	var type;
	var name = 'Anonymous';

	// Helper functions

	var confirmRec = function(msg) {
		socket.emit('confirm', { message : msg });
	}

	var confirmNum = function(roomname) {
		socket.broadcast.to(roomname+'-screen').emit('num_clients', {num : io.sockets.clients(roomname+'-controller').length });
	}

	// Socket Events

	socket.emit('Welcome', { room : 'World' });
	socket.join('world');

	socket.on('register', function(data) {
		type = data.type;
		room = data.room;

		socket.join('world-'+data.type);
		socket.join(data.room+'-'+data.type);	

		confirmRec('Joined as '+data.type+' in '+data.room);

		confirmNum(data.room);
	});

	socket.on('disconnect', function() {
		socket.leave('world-'+type);
		socket.leave(room+'-'+type);
		confirmNum(room);
	});

	socket.on('setName', function(data) {
		name = data.name;
		// No idea wtf does this do
		socket.set('name', data.name, function() { socket.emit('ready'); });
		confirmRec('Set name to '+data.name);
	});

	socket.on('controlclick', function(data) {
		console.log(data.name+' clicked a button');
		confirmRec('Thanks for clicking');

		socket.broadcast.to(room+'-screen').emit('controlclick', data);
	});

	// testing RTT initiated from Client side every 2 secs
	// in burst of 5 pings
	socket.on('rttHeartBeat', function(data) {
		data.server_time = Date.now();
		socket.emit('rttHeartBeat', data);
	});
});