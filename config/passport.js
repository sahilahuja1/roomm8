var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var mongo = require('../db/mongo');
var configAuth = require('./auth');

passport.use(
    new FacebookStrategy(
        {
            clientID : configAuth.facebookAuth.clientID,
            clientSecret : configAuth.facebookAuth.clientSecret,
            callbackURL : configAuth.facebookAuth.callbackURL,
            scope: ['user_friends'],
            profileFields: ['id', 'displayName', 'friends']
        },
        function(accessToken, refreshToken, profile, cb) {
            mongo.user.findOrCreate(
                { 'id' : profile.id,
                  'name' : profile.displayName },
                { 'token' : accessToken ,
                  'friends' : profile._json.friends.data},
                function (err, user) {
                    return cb(err, user);
                }
            );

            // UPDATE ALL THIS USER'S FRIENDS
        }
    )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});