const express = require('express');
var path = require('path');

var port = process.env.PORT || 3000;
//Starting Express app
const app = express();

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, '')));

app.use(express.static(path.join(__dirname, 'public')));

//Any routes will be redirected to the angular app
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(port);
server.timeout = 50000;