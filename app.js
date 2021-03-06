const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser'); 
const path = require('path');
const multiparty = require('connect-multiparty');

const app = express();

//Routes variables
const indexRoutes = require('./routes/index');
const guestRoutes = require('./routes/guest');
const userRoutes = require('./routes/users');

// Passport config
require('./config/passport')(passport);

//DB config 
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// EJS middleware
// app.use(expressLayouts);
app.set('view engine', 'ejs');

// Set path
app.use(express.static(path.join(__dirname, '/public/')));

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb'}));

// Multiparty middleware
app.use(multiparty());

// Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash middleware
app.use(flash());

// Global variables - success_msg, error_msg
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', indexRoutes);
app.use('/guest', guestRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    res.render('404');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));