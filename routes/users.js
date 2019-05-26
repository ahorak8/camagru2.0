const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Calling ensureAuthenticated function
const { ensureAuthenticated } = require('../config/auth');

// Variables for sending verification email
const nodemailer = require('nodemailer');
// const nodemailerSendgrid = require('nodemailer-sendgrid');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Transporter variable
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // api_key: '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'
        api_key: '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'
    }
}));

// User model
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => res.render('authentication/login'));

// Register page
router.get('/register', (req, res) => res.render('authentication/register'));

// Reset password page - send email
router.get('/reset-password', (req, res) => res.render('authentication/reset-password'));

// New password page (after following reset link)
router.get('/new-password', (req, res) => res.render('authentication/new-password'));

// User "My Account" page - update details
router.get('/my-account', ensureAuthenticated, (req, res) =>
    res.render('user/my-account', {
        userName: req.user.name,
        userEmail: req.user.email
    }));

// Update Account Handle
router.post('/update-account', ensureAuthenticated, (req, res) => {

});

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields filled in
    if(!name || !email || !password || !password2 ) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password != password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    // Check password length
    if(!password.length > 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) {
        res.render('authentication/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email })
        .then(user => {
            if(user) {
                // User email exists
                errors.push({ msg: 'Email is already registered'});
                res.render('authentication/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User( {
                    name,
                    email,
                    password
                });

                // Hash password (aka no plaintext password)
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        // Set password to hashed version
                        newUser.password = hash;

                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registed. Please verify your email to log in');
                                transporter.sendMail({
                                    to: email,
                                    from: 'no-reply@camagru.com',
                                    subject: 'Camagru - Verify Email',
                                    html: '<h1>You signed up to Camagru<1>'
                                });
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }

});

// Login Handle 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;