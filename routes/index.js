const express = require('express');
const router = express.Router();

//Controllers
const authenticationController = require('../controllers/authentication');

// Welcome page
router.get('/', (req, res) => res.render('welcome'));

// Login page
router.get('/login', authenticationController.getLogin);

// Register page
router.get('/register', authenticationController.getRegister);

// Register Handle
router.post('/register', authenticationController.postRegister);

// Login Handle 
router.post('/login', authenticationController.postLogin);

// Reset password page - send email
router.get('/forgot-password', authenticationController.getForgotPassword);

// Reset password handle

// New password page (after being given a temp password in email)
router.get('/new-password', authenticationController.getNewPassword);

// New pass handle

// Dashboard page
// router.get('/dashboard', ensureAuthenticated, (req, res) => 
//     res.render('dashboard', {
//         userName: req.user.name
//     })
// );



module.exports = router;