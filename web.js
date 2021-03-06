var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var livereload = require('livereload');
var logfmt = require('logfmt');
var pkg = require('./package.json');
var request = require('request');

var PROJECT_ROOT = __dirname;
var SERVER_ROOT = PROJECT_ROOT;

var ENV = require('./get-env.js');

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

if (ENV.IN_PRODUCTION) {
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
  var stripe = require("stripe")(ENV.STRIPE_SECRET);
  var stripeToken = req.body.stripeToken;
  //res.send(req.body);
  var charge = stripe.charges.create({
    amount: req.body.amount,
    currency: "usd",
    source: stripeToken,
    description: req.body.description
  }, function(err, charge) {
    var errMsg;

    if (err) {
      switch (err.type) {
        case 'StripeCardError':
          errMsg = err;
          break;

        case 'StripeInvalidRequest':
          errMsg = 'Please try again or contact hello@3strandcode.';
          break;

        default:
          errMsg = 'Please try again or contact hello@3strandcode.'
      }

      res.status(400).send(errMsg)
    } else {
      res.status(200).send(charge);
    }

  });
});


//
// Custom kinvey endpoints
app.use('/kinvey/:endpoint/', function(req, res) {
  var url = 'https://baas.kinvey.com/rpc/' + encodeURIComponent(ENV.KINVEY_APP_KEY) + '/custom/' + req.params.endpoint;
  var headers = {
    'Authorization': 'Basic ' + new Buffer(ENV.KINVEY_APP_KEY + ':' + ENV.KINVEY_MASTER_SECRET).toString('base64'),
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
