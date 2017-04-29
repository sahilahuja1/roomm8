var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');

var updateFriends = function(userId) {
	mongo.user.findOne({ 'id': userId } , function (err, person) {
  		if (err) return [];
  		
  		console.log(person);
	});
};