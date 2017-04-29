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

  if (text.includes('create new room')) {
  	var roomId = mongoose.Types.ObjectId();
  	mongo.user.findOne({ 'id': id } , function (err, person) {
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
	});

  }

  if (text.includes('leave room')) {
  	mongo.user.findOne({ 'id': id } , function (err, person) {
  		person.room = undefined;
		sendMessage(senderId, 'Successfully deleted room.');
	  	person.save(function (err) {
	        if(err) {
	            console.error('ERROR!');
	        }
	    });
	});
  }



  // messageDb.save(function(err) {
  //   if (err) throw err;
  //   console.log('Message saved!');
  // });

  // if (message.text) {
  // 	sendMessage(senderId, message.text);
  // }
};

module.exports = parseMessage;