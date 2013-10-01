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

var controlclick = function(key) {
	console.log('clicked');
	socket.emit('controlclick', { name: myname, action: key });
}




// HTML5 Device motion

if (window.DeviceOrientationEvent) {
	console.log("DeviceOrientation is supported");
	// Listen for the event and handle DeviceOrientationEvent object

    document.getElementById("doEvent").innerHTML = "DeviceOrientation";
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
        // gamma is the left-to-right tilt in degrees, where right is positive
        var tiltLR = eventData.gamma;

        // beta is the front-to-back tilt in degrees, where front is positive
        var tiltFB = eventData.beta;

        // alpha is the compass direction the device is facing in degrees
        var dir = eventData.alpha

        // call our orientation event handler
        // deviceOrientationHandler(tiltLR, tiltFB, dir);
        document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
		document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
		document.getElementById("doDirection").innerHTML = Math.round(dir);
    }, false);
} else {
    document.getElementById("doEvent").innerHTML = "Not supported."
}



if (window.DeviceMotionEvent) {
	window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
	document.getElementById("dmEvent").innerHTML = "Not supported"
}

function deviceMotionHandler(eventData) {
	var info, xyz = "[X, Y, Z]";

	// Grab the acceleration from the results
	var acceleration = eventData.acceleration;
	info = xyz.replace("X", acceleration.x);
	info = info.replace("Y", acceleration.y);
	info = info.replace("Z", acceleration.z);
	document.getElementById("moAccel").innerHTML = info;

	// Grab the acceleration including gravity from the results
	acceleration = eventData.accelerationIncludingGravity;
	info = xyz.replace("X", acceleration.x);
	info = info.replace("Y", acceleration.y);
	info = info.replace("Z", acceleration.z);
	document.getElementById("moAccelGrav").innerHTML = info;

	// Grab the rotation rate from the results
	var rotation = eventData.rotationRate;
	info = xyz.replace("X", rotation.alpha);
	info = info.replace("Y", rotation.beta);
	info = info.replace("Z", rotation.gamma);
	document.getElementById("moRotation").innerHTML = info;

	// Grab the refresh interval from the results
	info = eventData.interval;
	document.getElementById("moInterval").innerHTML = info;       
}