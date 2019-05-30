const express = require('express');
const router = express.Router();

// Calling ensureAuthenticated function
const { ensureAuthenticated } = require('../config/auth');

//Controllers
const authenticationController = require('../controllers/authentication');
const usersController = require('../controllers/users');

 // ** ACCOUNT ROUTES **
// User "My Account" page - update details
router.get('/my-account', ensureAuthenticated, usersController.getMyAccount);

// Update Account Handle 
router.post('/my-account', ensureAuthenticated, usersController.postMyAccount);

// Logout Handle
router.get('/logout', authenticationController.getLogout);

// Delete Account Handle
router.post('/delete-account', ensureAuthenticated, usersController.getDeleteAccount);


// ** IMAGE ROUTES **
// User My Images page
router.get('/my-images', ensureAuthenticated, usersController.getMyImages);

// Gallery page
router.get('/gallery', ensureAuthenticated, usersController.getGallery);

//Studio page
router.get('/studio', ensureAuthenticated, usersController.getStudio);

// Studio Handle
router.post('/studio', usersController.postStudio);

// Delete Image Handle
router.post('/delete-image', ensureAuthenticated, usersController.postDeleteImage);

// Like Handle 
router.post('/like', ensureAuthenticated, usersController.postLike);

// Image Page
router.get('/image', ensureAuthenticated, usersController.getImage);

router.get('/comment', ensureAuthenticated, usersController.getImage);

// Comments Handle
router.post('/comment', ensureAuthenticated, usersController.postComments);

module.exports = router;