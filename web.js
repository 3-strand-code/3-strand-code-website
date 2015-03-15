var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var livereload = require('express-livereload');
var logfmt = require('logfmt');
var pkg = require('./package.json');
var request = require('request');

var PROJECT_ROOT = __dirname;
var SERVER_ROOT = PROJECT_ROOT;

var KINVEY_APP_KEY = process.env.TSC_KINVEY_APP_KEY;
var KINVEY_APP_SECRET = process.env.TSC_KINVEY_APP_SECRET;
var KINVEY_MASTER_SECRET = process.env.TSC_KINVEY_MASTER_SECRET;

////

var app = express();

var httpPort = process.env.PORT || 8000;
var httpsPort = process.env.PORT ? 443 : 8001;

var sslOptions = {
    key: fs.readFileSync('fixtures/dev-key.pem'),
    cert: fs.readFileSync('fixtures/dev-cert.pem')
};

function onServerStart(port, https) {
    console.log(https ? 'https' : 'http', 'listening on', port);
}

function ensureSecure(req, res, next) {
    console.log('https://' + req.headers.host + ':' + httpsPort + req.url);
    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.headers.host + ':' + httpsPort + req.url);
}

/////////////////////////////////////////////////////////////
// SETUP APP
//

//
// Servers
//
http.createServer(app).listen(httpPort, onServerStart(httpPort));
https.createServer(sslOptions, app).listen(httpsPort, onServerStart(httpsPort, true));

//
// Livereload

livereload(app, {
    watchDir: SERVER_ROOT,
    https: sslOptions,
});


/////////////////////////////////////////////////////////////
// Routing
//

//
// Logger
// 
app.use(logfmt.requestLogger());

//
// Parse Req Body
// 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//
// Force HTTPS
//
app.all('*', ensureSecure);

//
// Serve Static
// 
app.use('/', express.static(__dirname + '/'));

//
// Payments
//
app.use('/charge', function(req, res) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here https://dashboard.stripe.com/account
    var stripe = require("stripe")("sk_test_0poqhPe77Ozg5bizoeEsMtX8");
    console.log(req.body);
    var stripeToken = req.body.stripeToken;

    var charge = stripe.charges.create({
        amount: 24900,
        currency: "usd",
        source: stripeToken,
        description: "payinguser@example.com"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
        }
    });
});

//
// Custom kinvey endpoints
// 
app.use('/kinvey/:endpoint/', function(req, res) {
    var url = 'https://baas.kinvey.com/rpc/' + encodeURIComponent(KINVEY_APP_KEY) + '/custom/' + req.params.endpoint;
    var headers = {
        'Authorization': 'Basic ' + new Buffer(KINVEY_APP_KEY + ':' + KINVEY_MASTER_SECRET).toString('base64'),
        'Content-Type': 'application/json'
    };

    var form = {};

    request.post({url: url, headers: headers, form: form}, function(error, response, body) {
        res.send(error || body);
    });
});

//
// Angular html5mode
// 
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


/////////////////////////////////////////////////////////////
// Keep Alive
// 

setInterval(function() {
    request.get("http://three-strand-code.herokuapp.com/");
}, 300000);
