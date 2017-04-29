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
				console.log('1');
				request({
			  		method: 'GET',
					uri: `https://graph.facebook.com/v2.6/${senderId}`,
					qs: {
						fields: 'first_name,last_name',
						access_token: PAGE_ACCESS_TOKEN
					},
				  	json: true
				}, function(error, response, body) {
					console.log('2');
					if (response.statusCode == 200) {
						mongo.user.findOne({'name' : {$regex : '.*' + body.first_name + '.*' + body.last_name + '.*'}}, 
							function (err, person) {
								console.log('3');
								person.pgid = senderId;
								return person.id;
							}
						);
					} else {
						console.log('4');
						return 0;
					}
				});
			} else {
				console.log('5');
				return person.id;
			}
		}
	});
};

var parseMessage = function(message, senderId, PAGE_ACCESS_TOKEN, sendMessage) {
  var text = message.text.toLowerCase();
  var id = identifyUser(senderId, PAGE_ACCESS_TOKEN);

 //  var messageDb = new mongo.message({
	// sender: senderId,
	// messageId: message.mid,
	// messageText: message.text
 //  });

  if (text.includes('create new room')) {
  	console.log('6');
  	var roomId = mongoose.Types.ObjectId();
  	console.log('7');
  	mongo.user.findOne({ 'id': id } , function (err, person) {
  		console.log('8');
  		if (!err && person) {
  			console.log('9');
  			if (!person.room) {
  				console.log('10');
  				person.room = roomId;
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
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