var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');

/*
create new room
join room Sahil
leave room

*/


var parseMessage = function(message, senderId, sendMessage) {
  var text = message.text.toLowerCase();
  var messageDb = new mongo.message({
	sender: senderId,
	messageId: message.mid,
	messageText: message.text
  });

  if (text.includes('create new room')) {
  	var roomId = mongoose.Types.ObjectId();
  	console.log(senderId);
  	mongo.user.findOne({ 'id': senderId } , function (err, person) {
  		if (!err && person) {
  			if (!person.room) {
  				person.room = roomId;
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
  			} else {
  				sendMessage(senderId, 'You are already in a room! Leave that room first.');
  			}
  		}
	});

  }






  messageDb.save(function(err) {
    if (err) throw err;
    console.log('Message saved!');
  });

  if (message.text) {
  	sendMessage(senderId, message.text);
  }
};

module.exports = parseMessage;