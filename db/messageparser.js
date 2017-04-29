var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');
var request = require('request');

/*
create new room
join room Sahil
leave room
*/

var identifyUser = function(senderId, PAGE_ACCESS_TOKEN) {
	mongo.user.findOne({ 'pgid': senderId } , function (err, person) {
		if (!err) {
			if (!person) {
				request({
			  		method: 'GET',
					uri: `https://graph.facebook.com/v2.6/${id}`,
					qs: {
						fields: 'first_name,last_name',
						access_token: this.token
					},
				  	json: true
				}, function(error, response, body) {
					  console.log('error:', error); // Print the error if one occurred 
					  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
					  console.log('body:', body); // Print the HTML for the Google homepage.   
				});
			} else {
				return person.id;
			}
		}

	});
};

var parseMessage = function(message, senderId, PAGE_ACCESS_TOKEN, sendMessage) {
  var text = message.text.toLowerCase();
  var id = identifyUser(senderId, PAGE_ACCESS_TOKEN);

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