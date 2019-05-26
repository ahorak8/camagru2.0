const express = require('express');
const router = express.Router();

// Calling ensureAuthenticated function
const { ensureAuthenticated } = require('../config/auth');

//Controllers
const authenticationController = require('../controllers/authentication');

 // Gallery page
 router.get('/gallery', ensureAuthenticated, (req, res) => 
    res.render('user/gallery', {
        userName: req.user.name
    })
);

//Studio page
router.get('/studio', ensureAuthenticated, (req, res) =>
    res.render('user/studio', {
        userName: req.user.name
    })
);

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

// Logout Handle
router.get('/logout', authenticationController.getLogout);

module.exports = router;