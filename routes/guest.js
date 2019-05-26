// Route for guests aka users not logged in
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

 // Gallery page for guests
router.get('/', (req, res) => res.render('guest/gallery'));

module.exports = router;