const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    localtunnel = require('localtunnel'),
    io = require('socket.io')(http),
    mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Maxi77', (err) => {
    if (err) console.log(err);
    else console.log('Connected to database');
});

let testMode = process.argv.slice(2)[0] === 'test';
// testMode = true; //REMOVE THIS
if (testMode) {
    console.log('Running app in testmode');
} else {
    console.log('Running app in pi mode');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/api/weather', require('./controllers/api/weatherController'));
const port = 8001;
http.listen(port);
console.log('Server running at port 8000');

require('./models/journey');
require('./services/bootstrapper.js')(testMode);
require('./socket/socketIncoming.js')(io);
require('./socket/socketOutgoing.js')(io);

var ngrok = require('ngrok');
ngrok.connect({
    proto: 'http', // http|tcp|tls 
    addr: 8080, // port or network address 
    // auth: 'user:pwd', // http basic authentication for tunnel 
    //subdomain: 'maxi77', // reserved tunnel name https://alex.ngrok.io 
    // authtoken: '12345', // your authtoken from ngrok.com 
    region: 'eu' // one of ngrok regions (us, eu, au, ap), defaults to us 
}, function (err, url) {

});
var tunnel;
var startTunnel = () => {
    tunnel = localtunnel(port, {
        subdomain: 'maxi77'
    }, function (err, tunnel) {
        if (err) {
            console.log('There was an error starting localtunnel: ' + err);
        }
        console.log('Localtunnel running at: ' + tunnel.url);
        tunnel.url;
    });
};

startTunnel();

tunnel.on('close', function () {
    console.log('close');
    // setTimeout(startTunnel, 10000);
    process.exit(1);
});

tunnel.on('error', function (err) {
    console.log(err);
    // setTimeout(startTunnel, 10000);
    process.exit(1);
});

process.on('uncaughtException', function (er) {
    console.log(er);
    // setTimeout(startTunnel, 10000);
    process.exit(1);
});

tunnel.on('close', function () {
    console.log('close');
    // setTimeout(startTunnel, 10000);
    process.exit(1);
});