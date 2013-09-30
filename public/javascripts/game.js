// Client Side js
var socket = io.connect('http://localhost');
socket.on('welcome', function(data) {
	console.log(data);
	socket.emit('setName', {name: 'Random Name'});
});

socket.on('confirm', function(data) {
	console.log('Confirm: '+data.message);
});

// If Controller

// If Main Screen


// Performance calls for use in rttHeartBeat
window.performance = window.performance || {};
performance.now = (function() {
    return performance.now       ||
        performance.mozNow    ||
        performance.msNow     ||
        performance.oNow      ||
        performance.webkitNow ||
        Date.now; 
})();


// For testing RTT in every 2 seconds - avg over 5 pings
function rttHeartBeat() {
	var timings = [];

	socket.on('rttHeartBeat', function(hb) {
		var time = performance.now();
		hb.client_end_time = time;
		var diff = hb.client_end_time - hb.client_start_time;
		timings.push(diff);

		// Currently does not take into account timeouts
		if (timings.length === 5) {
			var total = timings.reduce(function(a,b){return a+b;});
			// console.log('Avg rtt over 5 pings: '+(total/5.0)+ ' msecs');
			document.getElementById('ping').innerHTML = (total/5.0) + ' msecs';
		}
	});

	for (var i = 0; i < 5; i ++) {
		var time = performance.now();
		socket.emit('rttHeartBeat', {client_start_time: time});
	}
}

setInterval(rttHeartBeat, 2000);