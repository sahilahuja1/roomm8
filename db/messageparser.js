var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');


var parseMessage = function(message, senderId, sendMessage) {
  var messageDb = new mongo.message({
	sender: senderId,
	messageId: message.mid,
	messageText: message.text
  });

  messageDb.save(function(err) {
    if (err) throw err;
    console.log('Message saved!');
  });

  if (message.text) {
  	sendMessage(senderId, message.text);
  }
};

module.exports = parseMessage;