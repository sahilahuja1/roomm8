var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var mongo = require('../db/mongo');
var configAuth = require('./auth');

module.exports = function(passport) {    
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
                      'token' : token,
                       'email' : profile.emails[0].value,
                       'name' : profile.name.givenName + ' ' + profile.name.familyName },
                    function (err, user) {
                        return cb(err, user);
                    }
                );
            }
        )
    );
};