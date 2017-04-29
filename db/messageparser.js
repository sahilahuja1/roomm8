var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');

/*
create new room
join room Sahil
leave room
*/

var getId = function(senderId, PAGE_ACCESS_TOKEN) {
	// request.get({
	//   headers: { 'content-type': 'application/x-www-form-urlencoded' },
	//   url: "https://graph.facebook.com/v2.6/" + senderId + "?fields=first_name&access_token=" +PAGE_TOKEN,
	// }, function(err, response, body) {
	//   if (err) {
	//     return err
	//   }
	//   console.log(JSON.parse(body));
	//   var name = JSON.parse(body).first_name
	// });
};

var parseMessage = function(message, senderId, PAGE_ACCESS_TOKEN, sendMessage) {
  var text = message.text.toLowerCase();
  var id = getId(senderId, PAGE_ACCESS_TOKEN);

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