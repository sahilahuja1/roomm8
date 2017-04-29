var express = require('express');
var router = express.Router();
var checkValidKey = require('../middlewares/checkValidKey');

// Provided - do not modify
var credentalsAreValid = function (username, password) {
  return username === 'admin' && password === 'password';
};

// Implement the routes.

var loginAdmin = function (req, res, next) {
  res.render('login');
};

var credentalsSubmitted = function (req, res, next) {
  if (credentalsAreValid(req.body.username, req.body.password)) {
    req.session.isAuthenticated = true;
    res.send('Logged in as admin');
  } else {
    res.redirect('/loginAdmin');
  }
};

router.get('/loginAdmin', loginAdmin);
router.post('/loginAdmin', credentalsSubmitted);

module.exports = router;