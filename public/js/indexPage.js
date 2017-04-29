
mongo.message.find({sender: '1314955871892871'}, function(e, message) {
	console.log('here');
	message.forEach(function (msg) {
		$('#nav').append(msg.messageText);
		console.log(msg.messageText);
	});
});
