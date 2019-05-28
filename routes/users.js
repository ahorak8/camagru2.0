const express = require('express');
const router = express.Router();

// Calling ensureAuthenticated function
const { ensureAuthenticated } = require('../config/auth');

//Controllers
const authenticationController = require('../controllers/authentication');
const usersController = require('../controllers/users');

 // Gallery page
 router.get('/gallery', ensureAuthenticated, usersController.getGallery);

//Studio page
router.get('/studio', ensureAuthenticated, usersController.getStudio);

// Studio Handle
router.post('/studio', usersController.postStudio);

// User "My Account" page - update details
router.get('/my-account', ensureAuthenticated, usersController.getMyAccount);

// Update Account Handle 
router.post('/my-account', ensureAuthenticated, usersController.postMyAccount);

// Logout Handle
router.get('/logout', authenticationController.getLogout);

// Delete Account Handle
router.get('/delete-account', usersController.getDeleteAccount);

module.exports = router;