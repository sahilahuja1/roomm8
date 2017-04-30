var express = require('express');
var bodyParser = require('body-parser');
var request = require ('request');
var mongo = require('./db/mongo');
var messageparser = require('./db/messageparser');
var expressSession = require('express-session');

var app = express();
var router = express.Router();

// PASSPORT
var passport = require('passport');
require('./config/passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  'EAAZAHA840f8kBAK7qZBswki14cjR2zIps1mDZBE1f61qILkihFgNJjmOGzG7tjH0MX72QwdQeLx89ZBQQmuZBuWx0NJ3v0YBRekz2nZBBLTi8ZCKgsH6YsYXGoosByoZC2ZAiT6mGq5VhNGpVsBCOq0RdseBTRLZA82NlRiNuamQcIZAQZDZD';

app.get('/', function (req, res) {
	mongo.user.find({room: '5905319a09840f0004a7fb3c' }, function(e, roomates) {
		res.render('index', {'roomates' : roomates});
	});
});

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index')(passport);
app.use('/', routes);

// app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['user_friends']}));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'my_verification_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  identifyUser(message, senderID, PAGE_ACCESS_TOKEN);
}

var identifyUser = function(message, senderID, PAGE_ACCESS_TOKEN) {
	mongo.user.findOne({ 'pgid': senderID } , function (err, person) {
		if (!err) {
			if (!person) {
				request({
			  		method: 'GET',
					uri: `https://graph.facebook.com/v2.6/${senderID}`,
					qs: {
						fields: 'first_name,last_name',
						access_token: PAGE_ACCESS_TOKEN
					},
				  	json: true
				}, function(error, response, body) {
					if (response.statusCode == 200) {
						mongo.user.findOne({'name' : {$regex : '.*' + body.first_name + '.*' + body.last_name + '.*'}}, 
							function (err, person) {
								person.pgid = senderID;
								person.save(function (err) {
							        if(err) {
							            console.error('ERROR!');
							        }
							    });
				  				messageparser(message, person.id, senderID, PAGE_ACCESS_TOKEN, sendMessage);
							}
						);
					}
				});
			} else {
				messageparser(message, person.id, senderID, PAGE_ACCESS_TOKEN, sendMessage);
			}
		}
	});

	setTimeout(function() {
		return 1;
	}, 1000);
};

function sendMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// Start listening for requests
app.listen((process.env.PORT || 3000));

module.exports = app;