var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var livereload = require('livereload');
var logfmt = require('logfmt');
var pkg = require('./package.json');
var request = require('request');

var inProduction = process.env.NODE_ENV === 'production';

var PROJECT_ROOT = __dirname;
var SERVER_ROOT = PROJECT_ROOT;

var KINVEY_APP_KEY = process.env.TSC_KINVEY_APP_KEY;
var KINVEY_APP_SECRET = process.env.TSC_KINVEY_APP_SECRET;
var KINVEY_MASTER_SECRET = process.env.TSC_KINVEY_MASTER_SECRET;

if (!KINVEY_APP_KEY)        throw 'KINVEY_APP_KEY not set.';
if (!KINVEY_APP_SECRET)     throw 'KINVEY_APP_SECRET not set.';
if (!KINVEY_MASTER_SECRET)  throw 'KINVEY_MASTER_SECRET not set.';

////

var app = express();

var PORT = process.env.PORT || 8000;

var sslOptions = {
    cert: fs.readFileSync('fixtures/dev-cert.pem'),
    key: fs.readFileSync('fixtures/dev-key.pem'),
};

// Livereload
var lrOptions = {
    exts: [
        'html',
        'css',
        'js',
        'png',
        'gif',
        'jpg',
        'jpeg',
    ],
    exclusions: [
        '.git/',
        '.idea/',
        'bower_components/',
        'node_modules/',
    ],
    applyJSLive: false,
    applyCSSLive: true,
    https: sslOptions
};

function keepAlive() {
    setInterval(function() {
        request.get("https://three-strand-code.herokuapp.com/");
    }, 300000);
}


/////////////////////////////////////////////////////////////
// SERVER

if (inProduction) {
    http.createServer(app).listen(PORT);
    keepAlive();
} else {
    https.createServer(sslOptions, app).listen(PORT, function() {
        console.log('Server listening at https://localhost:' + PORT);
        livereload.createServer(lrOptions).watch(SERVER_ROOT);
    });
}


/////////////////////////////////////////////////////////////
// Routing


//
// Logger
app.use(logfmt.requestLogger());


//
// Parse Req Body
app.use(bodyParser.json());


//
// Serve Static
app.use('/', express.static(__dirname + '/'));


//
// Payments
app.use('/charge', function(req, res) {
    var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
    var stripeToken = request.body.stripeToken;
    var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: req.body.firstName + ' ' + req.body.lastName
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            req.status(400).send(err);
        }
    });
        // Set your secret key: remember to change this to your live secret key in production
    // See your keys here https://dashboard.stripe.com/account
    var stripe = require("stripe")("sk_test_0poqhPe77Ozg5bizoeEsMtX8");
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
app.use('/kinvey/:endpoint/', function(req, res) {
    var url = 'https://baas.kinvey.com/rpc/' + encodeURIComponent(KINVEY_APP_KEY) + '/custom/' + req.params.endpoint;
    var headers = {
        'Authorization': 'Basic ' + new Buffer(KINVEY_APP_KEY + ':' + KINVEY_MASTER_SECRET).toString('base64'),
        'Content-Type': 'application/json'
    };
    var form = req.body || {};

    request.post({url: url, headers: headers, form: form}, function(error, response, body) {

        if (error) {
            res.status(400).send(error)
        } else {
            res.status(response.statusCode).send(body);
        }

            
    });
});


//
// Angular html5mode
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
