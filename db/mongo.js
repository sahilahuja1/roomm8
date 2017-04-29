var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://sahilahuja:roompass@ds123351.mlab.com:23351/roomm8');
// NOTE: CHANGE TO USE ENVIRONMENT VARIABLES FOR USERNAME/PASSWORD

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var messageSchema = mongoose.Schema({
	sender: String,
	time: String,
	messageId: String,
	messageText: String
});

var Message = mongoose.model('Message', messageSchema);

var userSchema = mongoose.Schema({
    id : String,
    token : String,
    name : String,
    room : String,
    friends : [String]
});
userSchema.plugin(findOrCreate);

var User = mongoose.model('User', userSchema);

module.exports = {
	'message': Message, 
	'user': User
};