const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose'); //Logging in so we need to check if things match, use mongoose to connect
const bcrypt = require('bcryptjs'); // To compare the hashed passwords

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user email - check if email inputted matches any email in database
            User.findOne({ email: email })
                .then(user => {

                    // If user email is not found in the database
                    if(!user) {
                        return done(null, false, { message: 'That email is not registered'});
                    }
                    
                    // If user email has not been verified
                    if(!user.isVerified) {
                        return done(null, false, { message: 'Please check your inbox to verify your email'});
                    }

                    // Match user password (need to use bcrypt because the pw in database is hased and one submitted by user is plaintext)
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) { // If the user password is correct
                            return done(null, user);
                        } else { // If the user password is incorrect
                            return done(null, false, { message: 'Password incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // Method for serializing and deserializing the user instances to the session once logged in
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}