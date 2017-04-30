var passport = include('passport');

var authenticateFacebook = passport.authenticate('facebook');

// Export the middleware function for use in app.js
module.exports = authenticateFacebook;