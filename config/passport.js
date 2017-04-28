var FacebookStrategy = require('passport-facebook').Strategy;

var mongo = require('../db/mongo');
var configAuth = require('./auth');

module.exports = function(passport) {    
    passport.use(new FacebookStrategy({
        clientID : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL
    },
    function(token, refreshToken, profile, done) {
        mongo.user.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            if (err) {
                return done(err);
            } else if (user) {
                return done(null, user);
            } else {
                var newUser = new mongo.user();
                newUser.id = profile.id;
                newUser.token = token;
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.email = profile.emails[0].value;

                newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                });
            }
        });
    }));
};
