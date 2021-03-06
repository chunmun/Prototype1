
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
app.post('/choose', routes.choose);
app.get('/', routes.index);
app.get('/screen', routes.screen);
app.get('/screen/*', routes.screenWithRoom);
app.get('/controller', routes.controller);
app.get('/controller/*', routes.controllerWithRoom);

var allowCrossDomain = function(req, res, next) {
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
	var type = 'unknown type';
	var name = 'Anonymous';

	// Helper functions

	var serverMessage = function(msg) {
		socket.emit('server-message', { message : msg });
	}

	var serverNumbers = function(roomname) {
		io.sockets.in(roomname+'-screen').emit('server-num',{
			room : roomname,
			clients : (io.sockets.clients(roomname+'-controller').length || 0),
			screens : (io.sockets.clients(roomname+'-screen').length || 0)
		});
	}

	// Socket Events

	socket.join('world');
	serverMessage('MOTD: Welcome to Prototype-1');
	serverNumbers('world');

	socket.on('client-register', function(data) {
		type = data.type;
		room = data.room;
		console.log('A new '+data.type+' has joined Room : '+room);

		socket.join('world-'+data.type);
		socket.join(data.room+'-'+data.type);	

		serverMessage('Joined as '+data.type+' in Room : '+data.room);
		serverNumbers(data.room);
	});

	socket.on('disconnect', function() {
		socket.leave('world-'+type);
		socket.leave(room+'-'+type);

		serverNumbers(room);
		console.log('A '+type+' has left '+room);
	});

	socket.on('client-name', function(data) {
		name = data.name;
		serverMessage('Set name to '+data.name);
	});

	socket.on('controller-input', function(data) {
		serverMessage(data.action+' received for '+data.key);
		socket.broadcast.to(room+'-screen').emit('controller-input', data);
	});

	// Servce RTT initiated from Client side every 2 secs
	// in burst of 5 pings
	socket.on('screen-rttHeartBeat', function(data) {
		data.server_time = Date.now();
		socket.emit('server-rttHeartBeat', data);
	});
});