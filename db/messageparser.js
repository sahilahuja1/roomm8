var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');
var request = require('request');

/*
create new room
join room Sahil
leave room

- grocery list (add/remove)
- chores around house
- splitting bill
- 


*/

var parseMessage = function(message, id, senderId, PAGE_ACCESS_TOKEN, sendMessage) {
  var text = message.text.toLowerCase();
  mongo.user.findOne({ 'id': id } , function (err, person) {

	  if (text.includes('create new room') || text.includes('create room')) {
	  	var roomId = mongoose.Types.ObjectId();
  		if (!err && person) {
  			if (!person.room) {
  				person.room = roomId;
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
			  	person.save(function (err) {
			        if(err) {
			            console.error('ERROR!');
			        }
			    });
  			} else {
  				sendMessage(senderId, 'You are already in a room! Leave that room first.');
  			}
  		}
	  }

	  if (text.includes('leave room')) {
	  	mongo.user.findOne({ 'id': id } , function (err, person) {
	  		person.room = undefined;
			sendMessage(senderId, 'Successfully left room.');
		  	person.save(function (err) {
		        if(err) {
		            console.error('ERROR!');
		        }
		    });
		});
	  }

	  if (text.includes('join room')) {
	  	sendMessage(senderId, "Who's room would you like to join?");
	  	person.isJoiningRoom = true;
	  }

	  if (person.isJoiningRoom) {
	  	console.log('joining');
	  }

  });
};

module.exports = parseMessage;