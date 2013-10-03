// Socket registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

socket.emit('client-register', { type: 'screen', room: myroom });

// Socket Events
socket.on('controller-input', function(data) {
	console.log('Controller : '+data.name+', key : ' + data.key + ', action : '+ data.action);
	var keyboardevent;
	var keyval = Crafty.keys[data.key.toUpperCase()+'_ARROW'];
	switch (data.action) {
		case 'vmousedown':
			keyboardevent = 'KeyDown';
			break;
		case 'vmouseout':
			if (Crafty.keydown[keyval]) {
				keyboardevent = 'KeyUp';
				console.log('sending keyup event');
				break;
			} else {
				return; // Just ignore the event
			}
		case 'vmouseup':
			keyboardevent = 'KeyUp';
			break;
	}

	Crafty.trigger(keyboardevent, {key: keyval});
});
