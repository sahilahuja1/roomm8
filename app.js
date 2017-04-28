var express = require('express');
var app = express();
var router = express.Router();

app.get('/', function (req, res) {
  return res.send('hello world!');
});

// Start listening for requests
app.listen((process.env.PORT || 3000));

module.exports = app;