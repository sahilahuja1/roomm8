var express = require('express');
var app = express();
var router = express.Router();

app.get('/', function (req, res) {
  return res.send('hello world!');
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'my_verification_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});


// Start listening for requests
app.listen((process.env.PORT || 3000));

module.exports = app;