const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

// tell passport to use a new strategy for login
passport.use(new googleStrategy({
    clientID : "237659999234-n5oq12adn17ut7r6dnjp31ftitc9h5r3.apps.googleusercontent.com",
    clientSecret :"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",
    callbackURL : "http://localhost:8000/users/auth/google/callback"
},
    function (accessToken,refreshToken, profile, done ) {
        console.log('passport.use-new googleStrategy');
        // find a user
        User.findOne({email : profile.emails[0].value}).exec(function(err, user){
            if(err) { console.log('error in google strategy-passport', err); return }
            console.log(profile);

            if ( user) {
                // if found, set this user as req.user
                return done(null, user);
            } else {
                // if not found, create the user and set it as req.user (menas sign in the user)
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                },function(err, user){
                    if(err) { console.log('error in google strategy-passport', err); return }

                    return done(null, user);
        
                })
            }


        })
    }
))

module.exports = passport;


