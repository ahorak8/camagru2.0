const passport = require('passport'); 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ********************* Variables for Register Controller **************************************************
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
// ********************************************************************************************************

// Controller for Log in Page ** getLogin
exports.getLogin = (req, res) => res.render('authentication/login');

// Controller for Log in Handle ** postLogin
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/gallery',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

// Controller for Forgot Password page ** getForgotPassword
exports.getForgotPassword = (req, res) => res.render('authentication/forgot-password');

//Controller for Forgot Password Handle ** postForgotPassword
exports.postForgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
    .then(user => {
        if(!user) {
            req.flash('error', 'Email not linked to account');
            res.redirect('/forgot-password');
            return;
        } else {
            // Create passwordResetToken
            var seed = crypto.randomBytes(20);
            const passResetToken = crypto.createHash('sha1').update(seed + email).digest('hex');

            // Save passwordResetToken to DB
            user.passwordResetToken = passResetToken;

            user.save()
            .then(user => {
                req.flash('success_msg', 'Reset password link sent to email');

                // URL to send to user to verify
                URL = "http://localhost:5000/new-password?id=" + passResetToken;

                // Send verification email
                transporter.sendMail({
                    to: email,
                    from: 'no-reply@camagru.com',
                    subject: 'Camagru - Reset Password link',
                    html: '<h1>Youve requested a password reset for Camagru<h1>',
                    html: `Click the following link to change your password:</p><p>${URL}</p>`,
                });
                res.redirect('/forgot-password');
            })
        }
    })
}

// Controller for New Password page ** getNewPassword
exports.getNewPassword = (req, res) => {
    res.render('authentication/new-password');
}

// Controller for New Password Handle ** postNewPassword
exports.postNewPassword = (req, res) => {
    var passResetTokenFromURL = req.query.id;
    const { password, password2 } = req.body;

    User.findOne({ passResetToken: passResetTokenFromURL })
    .then(user => {
        if(!user) {
            req.flash('error', 'Reset token not valid');
            res.redirect('/forgot-password');
            return;
        }
        if (!password || !password2) {
            req.flash('error', 'Fill in your new password');
            res.redirect('back');
            return;
        }
        if (password != password2) {
            req.flash('error', 'Passwords do not match');
            res.redirect('back');
            return;
        }
        if (!password.length > 6) {
            req.flash('error', 'Password must be at least 6 characters');
            res.redirect('back');
            return;
        }
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;

                newHashPassword = hash;
                user.password = newHashPassword;
                user.save();
                req.flash('success_msg', 'Password updated. You can log in using your new password');
                res.redirect('/login');
            }))
    })
    .catch (err => console.log(err));
}

// Controller for Logout Handle ** getLogout
exports.getLogout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
};

//Control for Register Page ** getRegister
exports.getRegister = (req, res) => res.render('authentication/register');

// Controller for Register Handle ** postRegister
exports.postRegister = (req, res) => {
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
                // User email already in use
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

                        // Create verifyToken
                        var seed = crypto.randomBytes(20);
                        const verifyToken = crypto.createHash('sha1').update(seed + email).digest('hex');

                        // Save verifyToken to DB
                        newUser.verifyToken = verifyToken;
                        
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registed. Please verify your email to log in');
                                
                                // URL to send to user to verify
                                URL = "http://localhost:5000/verify?id=" + verifyToken;

                                // Send verification email
                                transporter.sendMail({
                                    to: email,
                                    from: 'no-reply@camagru.com',
                                    subject: 'Camagru - Verify Email',
                                    html: '<h1>You signed up to Camagru<h1>',
                                    html: `Click the following link to confirm your account:</p><p>${URL}</p>`,
                                });
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }
};

// Controller for Verify Handle ** getVerify
exports.getVerify = (req, res) => {
    var verifyTokenFromURL = req.query.id;

    // Find the user that matches the verifyToken
    User.findOne({ verifyToken: verifyTokenFromURL })
    .then(user => {
        if(!user) {
            req.flash('error', 'Email is already verified and in use');
            res.redirect('/register');
            return;
        }
        user.isVerified = true;
        user.verifyToken = ''; // Setting verifyToken to nothing once validation

        user.save(); 
        req.flash('success_msg', 'Thank you for verifying. You may now login');
        res.redirect('/login');
    })
    .catch(err => console.log(err));
};
