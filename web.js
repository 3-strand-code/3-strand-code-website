var express = require('express');
var livereload = require('express-livereload');
var logfmt = require('logfmt');
var pkg = require('./package.json');
var request = require('request');

var SERVER_ROOT = __dirname + '/build/';

var kinveyAppKey = process.env.TSC_KINVEY_APP_KEY;
var kinveyAppSecret = process.env.TSC_KINVEY_APP_SECRET;
var kinveyMasterSecret = process.env.TSC_KINVEY_MASTER_SECRET;

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


var url = 'https://baas.kinvey.com/rpc/' + kinveyAppKey + '/custom/discounts';

var headers = {
    'Authorization': 'Basic ' + new Buffer(kinveyAppKey + ':' + kinveyMasterSecret).toString('base64'),
    'Content-Type': 'application/json'
};

var form = {};

request.post({url: url, form: form, headers: headers}, function(error, response, body) {
    //if (!error && response.statusCode == 200) {
    //    console.log(body) // Show the HTML for the Google homepage.
    //}
    console.log(error);
    //console.log(response);
    console.log(body);
});
