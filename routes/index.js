var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');

var isAuthenticated = function (req, res, next) {
	console.log('user: ', req.user);
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function (passport) {
	router.get('/', function (req, res) {
		res.render('index', {'roomates' : roomates});
	});

	router.get('/home', isAuthenticated, function(req, res){
		console.log(req.user.displayName);

		mongo.user.findOne({id: req.user.id },
		 	function(e, currUser) {
				mongo.user.find({room: currUser.room }, 
					function(e, roomates) {
						res.render('home', 
							{'user': req.user, 'roomates' : roomates});
					}
				);

		 	}
	 	);
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