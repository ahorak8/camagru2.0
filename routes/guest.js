// Route for guests aka users not logged in
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Controllers
const guestController = require('../controllers/guest');

 // Gallery page for guests
router.get('/', guestController.getGuestGallery);

module.exports = router;