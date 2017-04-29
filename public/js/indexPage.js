var mongo = require('../../db/mongo');

mongo.message.find({sender: '1314955871892871' }, function(e, message) {
	message.forEach(function (msg) {
		$('#nav').append(msg.messageText);
		console.log(msg.messageText);
	});
});
