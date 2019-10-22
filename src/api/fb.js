/*
import qs from 'qs'

const CLIENT_ID = 'dhjagtdddsg'
const ROOT_URL = 'https://api.imgur.com'

export default {
  login() {
    const queryString = {
      client_id: CLIENT_ID,
      response_type='token'
    }

   window.location =  `${ROOT_URL}/oauth2/authorize?${qs.stringify(querystring)}`
  }
}
*/
require('dotenv').config()
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8001/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ fbId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));