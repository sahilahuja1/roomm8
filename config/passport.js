var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var mongo = require('../db/mongo');
var configAuth = require('./auth');

passport.use(
    new FacebookStrategy(
        {
            clientID : configAuth.facebookAuth.clientID,
            clientSecret : configAuth.facebookAuth.clientSecret,
            callbackURL : configAuth.facebookAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log('here');
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            console.log(cb);
            var userDb = mongo.user.findOrCreate(
                { 'id' : profile.id,
                  'token' : accessToken,
                  'name' : profile.displayName },
                function (err, user) {
                    return cb(err, user);
                }
            );

            userDb.save(function(err, click, created) {
                if (err) throw err;
                console.log('Message saved!');
            });
        }
    )
);
