var express = require('express');
var livereload = require('express-livereload');
var logfmt = require('logfmt');
var pkg = require('./package.json');

var SERVER_ROOT = __dirname + '/build/';

//////////////////////////////////////////////////////////////////
// SETUP APP
//

var app = express();

//
// Livereload
livereload(app, {
    // options: https://github.com/napcs/node-livereload#options
    watchDir: SERVER_ROOT
});

//////////////////////////////////////////////////////////////////
// SETUP SERVER

//

var port = Number(process.env.PORT || 8000);
var server = app.listen(port, function() {
    console.log('Listening on ' + port);
});

//
// logging
app.use(logfmt.requestLogger());

//
// static serve
app.use('/', express.static(__dirname + '/'));

// let angular handle all routing requests (html5mode)
app.all('/*', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});
