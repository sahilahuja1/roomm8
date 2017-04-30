var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://sahilahuja:roompass@ds123351.mlab.com:23351/roomm8');
// NOTE: CHANGE TO USE ENVIRONMENT VARIABLES FOR USERNAME/PASSWORD

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var choreSchema = mongoose.Schema({
  room: String,
  chores: [String]
});

var Chore = mongoose.model('Chore', choreSchema);

var userSchema = mongoose.Schema({
  id : String,
  pgid : String,
  token : String,
  name : String,
  room : String,
  friends : [{name: String, id: String}],
  isJoiningRoom : Boolean,
  isAddingChore : Boolean,
  isRemovingChore : Boolean,
  isRequestingPayment : Boolean
});
userSchema.plugin(findOrCreate);

var User = mongoose.model('User', userSchema);

// var paymentRequestSchema = mongoose.Schema({
// 	id : String,
// 	amount : Number,
// 	description : String
// });

// var PaymentRequest = mongoose.model('PaymentRequest', paymentRequestSchema);

// var roomPaymentsSchema = mongoose.Schema({
// 	room : String,
// 	payments : [{
// 		id : String,
// 		amount : Number
// 	}]
// });

// var RoomPayments = mongoose.model('RoomPayments', roomPaymentsSchema);

module.exports = {
  'chore': Chore, 
  'user': User
  // 'paymentRequest' : PaymentRequest,
  // 'roomPayments' : RoomPayments
};