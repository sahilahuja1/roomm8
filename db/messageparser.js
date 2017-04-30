var mongo = require('./mongo');
var passport = require('passport');
var mongoose = require('mongoose');
var request = require('request');

var parseMessage = function(message, id, senderId, PAGE_ACCESS_TOKEN, sendMessage) {
  var text = message.text.toLowerCase();
  mongo.user.findOne({ 'id': id } , function (err, person) {

	  if (text.includes('create new room') || text.includes('create room')) {
  		if (!err && person) {
  			if (!person.room) {
  				person.room = mongoose.Types.ObjectId();
  				sendMessage(senderId, 'Successfully created new room. Now add friends!');
  			} else {
  				sendMessage(senderId, 'You are already in a room! Leave that room first.');
  			}
  		}
	  }

	  if (text.includes('leave room')) {
  		person.room = undefined;
		  sendMessage(senderId, 'Successfully left room.');
	  }

	  if (text.includes('join room')) {
      if (person.room) {
        sendMessage(senderId, "You are already in a room!");
      } else {
  	  	sendMessage(senderId, "Who's room would you like to join? (Enter full name)");
  	  	person.isJoiningRoom = true;
      }
	  } else if (person.isJoiningRoom) {
			mongo.user.findOne({'name' : message.text}, 
				function (err, friend) {
					if (friend) {
						if (friend.room) {
							person.room = friend.room;
							person.save(function (err) {
    					  if(err) {
    					    console.error('ERROR!');
    					  }
    				  });
              sendMessage(senderId, 'Added to room');
						} else {
							sendMessage(senderId, friend.name + ' is not in a room');
						}
					} else {
						sendMessage(senderId, 'Try another name');
					}
				}
			);
      person.isJoiningRoom = undefined;
	  }

    if (text.includes('add chore')) {
      if (person.room) {
        sendMessage(senderId, 'What chore would you like to add?');
        person.isAddingChore = true;
      } else {
        sendMessage(senderId, 'Add a room first.');
      }
    } else if (person.isAddingChore) {
      mongo.chore.findOne({'room' : person.room},
        function (err, chore) {
          if (!err) {
            if (chore) {
              chore.chores.push(message.text);
              chore.save(function (err) {
                if(err) {
                  console.error('ERROR!');
                }
              });
            } else {
              chore = new mongo.chore({
                'room' : person.room,
                'chores' : [message.text]
              });
              chore.save(function (err) {
                if(err) {
                  console.error('ERROR!');
                }
              });
            }

            mongo.user.find({'room' : person.room},
              function(err, roomates) {
                for (var i = 0; i < roomates.length; i++) {
                  if (roomates[i].pgid) {
                    sendMessage(roomates[i].pgid, 'New Chore Added: ' + message.text);
                  } 
                }
              }
            );
          }
        } 
      );  
      person.isAddingChore = undefined;
    }

    if (text.includes('get chore')) {
      mongo.chore.findOne({'room' : person.room},
        function (err, chore) {
          if (chore.chores.length > 0) {
            sendMessage(senderId, chore.chores.join('\n'));
          } else {
            sendMessage(senderId, 'No chores yet! Add chore.');
          }
        }
      );
    }

    if (text.includes('remove chore')) {
      if (person.room) {
        sendMessage(senderId, 'What chore would you like to remove?');
        mongo.chore.findOne({'room' : person.room},
          function (err, chore) {
            sendMessage(senderId, chore.chores.join('\n'));
          }
        );
        person.isRemovingChore = true;
      } else {
        sendMessage(senderId, 'Add a room first.');
      }
    } else if (person.isRemovingChore) {
      mongo.chore.findOne({'room' : person.room},
        function (err, chore) {
          for (var i = 0; i < chore.chores.length; i++) {
            if (chore.chores[i].toLowerCase().includes(text)) {
              var removingChore = chore.chores[i];
              chore.chores.splice(i, 1); 
              i--;
              mongo.user.find({'room' : person.room},
                function(err, roomates) {
                  for (var i = 0; i < roomates.length; i++) {
                    if (roomates[i].pgid) {
                      sendMessage(roomates[i].pgid, person.name + ' completed chore: ' + removingChore);
                    } 
                  }
                }
              );
            }
          }
          chore.save(function (err) {
            if (err) {
              console.error('ERROR!');
            }
          });
        }
      );
      person.isRemovingChore = undefined;
    }

    if (text.includes('remove all chores')) {
      mongo.chore.findOne({'room' : person.room},
        function (err, chore) { 
          chore.chores = [];
          chore.save(function (err) {
            if (err) {
              console.error('ERROR!');
            }
          });
          mongo.user.find({'room' : person.room},
            function(err, roomates) {
              for (var i = 0; i < roomates.length; i++) {
                if (roomates[i].pgid) {
                  sendMessage(roomates[i].pgid, 'All chores completed by ' + person.name);
                } 
              }
            }
          );
        }
      );
    }

    // GET ROOMATES
    // request payment, mark paid

    if (text.includes('help')) {
      sendMessage(senderId, 'List of available commands:\ncreate room\njoin room\nleave room\nadd chore\nget chore\nremove chore\nremove all chores');
    }

    person.save(function (err) {
      if (err) {
        console.error('ERROR!');
      }
    });
  });
};

module.exports = parseMessage;