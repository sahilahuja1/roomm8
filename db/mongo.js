var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var messageSchema = mongoose.Schema({
	sender: Number,
	time: Date,
	messageId: Number,
	messageText: String
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;