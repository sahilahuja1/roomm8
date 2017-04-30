var express = require('express');
var router = express.Router();
var mongo = require('../db/mongo');

var isAuthenticated = function (req, res, next) {
  console.log('user: ', req.user);
  if (req.isAuthenticated())
  return next();
  res.redirect('/');
};

module.exports = function (passport) {
  router.get('/', function (req, res) {
  res.render('index', {'roomates' : roomates});
  });

  router.get('/home', isAuthenticated, function (req, res) {
  console.log('user: ', req.user);

  mongo.user.findOne({id: req.user.id },
    function(e, currUser) {
      if (currUser.room) {
        mongo.user.find({room: currUser.room }, 
          function(e, roomates) {
            mongo.chore.findOne({room: currUser.room}, 
              function(e, chore) {
                if (chore) {
                	res.render('home', 
                  	{'user': req.user, 'roomates' : roomates, 'chores' : chore.chores}
                	);
                } else {
                	res.render('home', 
                    {'user': req.user, 'roomates' : roomates, 'chores' : []}
                	);
                } 
              }
            );
          }
        );
      } else {
        res.render('home', 
          {'user': req.user, 'roomates': [], 'chores' : []}
        );
      }
    }
   );
  });

  router.get('/auth/facebook', 
    passport.authenticate('facebook', {scope: ['user_friends']})
  );

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/home', 
      failureRedirect: '/' 
    })
  );

  return router;
};