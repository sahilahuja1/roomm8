var FacebookStrategy = require('passport-facebook').Strategy;

var mongo = require('../db/mongo');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        mongo.user.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
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
