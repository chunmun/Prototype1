// Add fastclick to controllers
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

var controlclick = function() {
	console.log('clicked');
	socket.emit('controlclick', { name: myname, click: 1 });
}

socket.emit('register', { type: 'controller' });