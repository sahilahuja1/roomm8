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
  		if (!err && person) {
  			if (!person.room) {
  				person.room = mongoose.Types.ObjectId();
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
  			} else {
  				sendMessage(senderId, 'You are already in a room! Leave that room first.');
  			}
  		}
	  }

	  if (text.includes('leave room')) {
  		person.room = undefined;
		  sendMessage(senderId, 'Successfully left room.');
	  }

	  if (text.includes('join room')) {
      // if (person.room) {
      //   sendMessage(senderId, "You are already in a room!");
      // } else {
  	  	sendMessage(senderId, "Who's room would you like to join? (Enter full name)");
  	  	person.isJoiningRoom = true;
      // }
	  } else if (person.isJoiningRoom) {
			mongo.user.findOne({'name' : message.text}, 
				function (err, friend) {
					if (friend) {
						if (friend.room) {
							person.room = friend.room;
							person.save(function (err) {
						        if(err) {
						            console.error('ERROR!');
						        }
						    });
						} else {
							sendMessage(senderId, 'That person is not in a room');
						}
					} else {
						sendMessage(senderId, 'Try another name');
					}
				}
			);
      person.isJoiningRoom = undefined;
	  }

    person.save(function (err) {
      if(err) {
          console.error('ERROR!');
      }
    });
  });
};

module.exports = parseMessage;