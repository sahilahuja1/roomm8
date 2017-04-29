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
            mongo.user.findOrCreate(
                { 'id' : profile.id,
                  'token' : accessToken,
                  'name' : profile.displayName },
                function (err, user) {
                    return cb(err, user);
                }
            );
        }
    )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});