var controlclick = function() {
	console.log('clicked');
	socket.emit('controlclick', { click: 1 });
}

socket.emit('register', { type: 'controller' });