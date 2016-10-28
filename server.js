const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Maxi77', (err) => {
    if (err) console.log(err);
    else console.log('Connected to database');
});

const testMode = process.argv.slice(2)[0] === 'test';
if (testMode) {
    console.log('Running app in testmode');
} else {
    console.log('Running app in pi mode');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/api/weather', require('./controllers/api/weatherController'));

http.listen(8000);
console.log('Server running at port 8000');

require('./models/journey');
require('./services/bootstrapper.js')(testMode);
require('./socket/socketIncoming.js')(io);
require('./socket/socketOutgoing.js')(io);