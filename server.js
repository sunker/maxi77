var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public'))); 
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use('/api/weather', require('./controllers/api/weatherController'));
// require('./controllers/indexController')(app);

app.listen(8000);
console.log('Server running at port 8080');
