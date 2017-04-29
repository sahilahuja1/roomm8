var mongoose = require('mongoose');
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
    room : String
});

var User = mongoose.model('User', userSchema);

userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({_id : profile.id},function(err,result){ 
        if(!result){
            userObj.id = profile.id;
            userObj.token = profile.token;
            userObj.name = profile.name;
            userObj.room = profile.room;
            userObj.save(cb);
        } else{
            cb(err,result);
        }
    });
};

module.exports = {
	'message': Message, 
	'user': User
};