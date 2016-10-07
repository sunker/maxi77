(function(exports) {

	exports.connect = function(gps) {

		// hook up gps
		var gps_connect = function() {
			gps.connect('/dev/ttyAMA0', 4800, function(err) {

				if(err) {
					console.log('GPS Error: ' + err);
				} else {
					console.log('GPS Connected');
				}

			});
		};

        	gps.on('fix', function(data) {
				console.log('gps', data);
			});

			gps.on('nav-info', function(data) {
				console.log('gps', data);
			});

            gps_connect();
		// io.sockets.on('connection', function(socket) {
		// 	gps.on('fix', function(data) {
		// 		socket.emit('gps', data);
		// 	});

		// 	gps.on('nav-info', function(data) {
		// 		socket.emit('gps', data);
		// 	});

		// 	socket.on('gps.connect', function() {
		// 		gps_connect();
		// 	});


		// 	socket.on('foo', function(bar) {
		// 		console.log('foo' + bar);
		// 	});
		// });

		// auto connect the gps
		// //gps_connect();
		// controller.connect();


	};

})(module.exports);
