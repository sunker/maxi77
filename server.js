var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket = require('./controllers/socket.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Maxi77');

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json());

app.use('/api/weather', require('./controllers/api/weatherController'));

// app.listen(8000);
http.listen(8000);
console.log('Server run§xning at port 8080');

io.sockets.on('connection', socket);