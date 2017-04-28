var express = require('express');
var app = express();
var router = express.Router();

app.get('/', function (req, res) {
  return res.send('hello world!');
});

// Start listening for requests
app.listen(3000, function () {
  console.log('Listening on port 3000');
});


module.exports = app;