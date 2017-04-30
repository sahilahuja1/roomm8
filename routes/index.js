var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');

var isAuthenticated = function (req, res, next) {
	console.log(req);
	if (req.isAuthenticated())
		return next();
	res.redirect('/pluto');
}

module.exports = function (passport) {
	router.get('/', function (req, res) {
		mongo.user.find({room: '5905319a09840f0004a7fb3c' }, 
			function(e, roomates) {
				res.render('index', {'roomates' : roomates});
			}
		);
	});

	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	router.get('/auth/facebook', 
		passport.authenticate('facebook', {scope: ['user_friends']})
	);

	router.get('/auth/facebook/callback',
	  passport.authenticate('facebook', {
	  	successRedirect: '/home', 
	  	failureRedirect: '/' 
	  })
  	);

	return router;
};