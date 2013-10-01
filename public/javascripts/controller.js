// Add fastclick to controllers
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

// Socket Registration code

var path = window.location.pathname.slice(1).split('/');
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	socket.emit('register', { type: 'controller', room: path[1] });
} else {
	socket.emit('register', { type: 'controller', room: 'lobby'});
}

// Socket Events

var controlclick = function() {
	console.log('clicked');
	socket.emit('controlclick', { name: myname, click: 1 });
}