// Socket registration code

var path = window.location.pathname.slice(1).split('/');
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	socket.emit('register', { type: 'screen', room: path[1] });
} else {
	socket.emit('register', { type: 'screen', room: 'lobby'});
}

// Socket Events

socket.on('num_clients', function(data) {
	console.log('Total Connected: '+data.num);
	document.getElementById('connected').innerHTML = 'Total Clients : '+data.num;
});

socket.on('controlclick', function(data) {
	console.log(data);
});

socket.on('message', function(data) {
	console.log('Message : '+data);
});