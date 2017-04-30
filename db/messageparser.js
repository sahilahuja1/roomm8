var mongo = require('./mongo');
var mongoose = require('mongoose');

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
        sendMessage(senderId, 'You are already in a room!');
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
          		  if (err) {
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

    if (text.includes('get roomates')) {
      mongo.user.find({'room' : person.room},
        function(err, roomates) {
          var roomatesString = '';
          for (var i = 0; i < roomates.length; i++) {
            roomatesString += roomates[i].name + '\n';
          }
          sendMessage(senderId, roomatesString);
        }
      );
    }

    // if (text.includes('request') || text.includes('charge')) {
    //   if (person.room) {
    //     sendMessage(senderId, 'What chore would you like to add?');
      
    //     mongo.roomPayments.findOne({'room' : person.room},
    //       function (err, roomPayment) {
    //         if (!err) {
    //           if (roomPayment) {
    //             var numRoomates = roomPayment.payments.length;
    //             if (numRoomates < 2) {
    //               sendMessage(senderId, 'You have no roomates!');
    //             } else {
    //               var amountRequesting = parseInt(text);
    //               var dividedAmount = amountRequesting/(numRoomates - 1);
    //               for (var i = 0; i < numRoomates; i++) {
    //                 if (roomPayment.payments[i].id == id) {
    //                   roomPayment.payments[i].amount -= amountRequesting;
    //                 } else {
    //                   roomPayment.payments[i].amount += dividedAmount;
    //                 }
    //               }
    //               roomPayment.save(function (err) {
    //                 if (err) {
    //                   console.error('ERROR!');
    //                 }
    //               });
    //               person.isRequestingPayment = true;
    //             }
    //           } else {
    //             mongo.user.find({'room' : person.room},
    //               function(err, roomates) {
    //                 var numRoomates = roomates.length;
    //                 if (numRoomates < 2) {
    //                   sendMessage(senderId, 'You have no roomates!');
    //                 } else {
    //                   var amountRequesting = parseInt(text);
    //                   var dividedAmount = amountRequesting/(numRoomates - 1);
    //                   var paymentsArray = [];
    //                   for (var i = 0; i < numRoomates; i++) {
    //                     if (roomates[i].id == id) {
    //                       paymentsArray.push({'id': id, 'amount' : (amountRequesting * -1)})
    //                     } else {
    //                       paymentsArray.push({'id': roomates[i].id, 'amount': dividedAmount})
    //                     }
    //                   }
    //                   roomPayment = new mongo.roomPayments({
    //                     'room' : person.room,
    //                     'payments' : paymentsArray
    //                   });
    //                   roomPayment.save(function (err) {
    //                     if (err) {
    //                       console.error('ERROR!');
    //                     }
    //                   });
    //                 }
    //               }
    //             );
    //           }

    //         }
    //       } 
    //   }
    // } else if (person.isRequestingPayment) {

    //   person.isRequestingPayment = undefined;
    // }

    if (text.includes('help')) {
      sendMessage(senderId, 'List of available commands:\ncreate room\njoin room\nleave room\nadd chore\nget chore\nremove chore\nremove all chores\nget roomates');
    }

    person.save(function (err) {
      if (err) {
        console.error('ERROR!');
      }
    });
  });
};

module.exports = parseMessage;