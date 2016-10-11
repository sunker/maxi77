var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket = require('./controllers/socketIncoming.js')(io);
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/Maxi77', function(err){ 
     if(err) console.log(err); 
     else console.log('Connected to database');
    });


console.log(process.argv.slice(2)[0]);

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json(    ));

app.use('/api/weather', require('./controllers/api/weatherController'));    

// app.listen(8000);
http.listen(8000);
console.log('Server running at port 8000');

require('./services/bootstrapper.js')();
require('./services/socketOutgoing.js')(io);
// io.sockets.on('connection', socket);

// io.sockets.on('connection', socket);