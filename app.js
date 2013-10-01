
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
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
app.get('/users', user.list);
app.get('/screen', routes.screen);
app.get('/controller', routes.controller);

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



// Websockets stuff

var io = io.listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket) {
	var confirmRec = function(msg) {
		socket.emit('confirm', { message : msg });
	}

	var confirmnum = function(roomname) {
		socket.broadcast.to('testroom-screen').emit('num_clients', {num : io.sockets.clients(roomname).length });
	}

	socket.emit('welcome', { hello : 'world'});

	socket.on('register', function(data) {
		if (data.type === 'screen') {
			socket.join('testroom-screen');
			confirmRec('Joined as screen');
		} else if (data.type === 'controller') {
			socket.join('testroom-controller');
			confirmRec('Joined as controller');
		}

		socket.join('testroom');
		confirmnum('testroom-controller');
	});

	socket.on('disconnect', function() {
		socket.broadcast.to('testroom').emit('num_clients', {num : io.sockets.clients('testroom-controller').length - 1});
	});

	socket.on('setName', function(data) {
		socket.set('name', data.name, function() { socket.emit('ready'); });
		confirmRec('Set name to '+data.name);
	});

	socket.on('controlclick', function(data) {
		console.log(data.name+' clicked a button');
		confirmRec('Thanks for clicking');

		socket.broadcast.to('testroom-screen').emit('controlclick', data);
	});

	// testing RTT initiated from Client side every 2 secs
	// in burst of 5 pings
	socket.on('rttHeartBeat', function(data) {
		data.server_time = Date.now();
		socket.emit('rttHeartBeat', data);
	});
});