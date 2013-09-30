socket.emit('register', { type: 'screen' });

socket.on('num_clients', function(data) {
	console.log('Total Connected: '+data.num);
	document.getElementById('connected').innerHTML = 'Total Connected : '+data.num;
});

socket.on('controlclick', function(data) {
	console.log(data);
});