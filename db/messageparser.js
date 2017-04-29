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

  console.log('id', id);

 //  var messageDb = new mongo.message({
	// sender: senderId,
	// messageId: message.mid,
	// messageText: message.text
 //  });

  if (text.includes('create new room')) {
  	console.log('6');
  	var roomId = mongoose.Types.ObjectId();
  	console.log('7');
  	console.log(senderId);
  	console.log(id)
  	mongo.user.findOne({ 'id': id } , function (err, person) {
  		console.log('8');
  		console.log(err);
  		console.log(person);
  		if (!err && person) {
  			console.log('9');
  			if (!person.room) {
  				console.log('10');
  				person.room = roomId;
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
			  	person.save(function (err) {
			        if(err) {
			            console.error('ERROR!');
			        }
			    });
  			} else {
  				console.log('11');
  				sendMessage(senderId, 'You are already in a room! Leave that room first.');
  			}
  		}
	});

  }


  // messageDb.save(function(err) {
  //   if (err) throw err;
  //   console.log('Message saved!');
  // });

  if (message.text) {
  	sendMessage(senderId, message.text);
  }
};

module.exports = parseMessage;