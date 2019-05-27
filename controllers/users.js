// Controller for My Account page ** getMyAccount
exports.getMyAccount = (req, res) =>
res.render('user/my-account', {
    userName: req.user.name,
    userEmail: req.user.email,
    userID: req.user._id,
    userEmailNotification: req.user.emailNotification
});

// Controller for My Account Handle ** postMyAccount
exports.postMyAccount = (req, res) => {
    const { newName, newEmail, newPassword, newPassword2, emailNotifications } = req.body;

    if(newPassword || newPassword2) {
        // Check passwords match
        if(newPassword != newPassword2) {
           req.flash('error_msg', 'Passwords do not match');
        }
        // Check password length
        if(!newPassword.length > 6) {
            req.flash('error_msg', 'Password must be at least 6 characters');
        }
    }
    
};

// Controller for Studio page ** getStudio
exports.getStudio = (req, res) =>
res.render('user/studio', {
    userName: req.user.name
});

// Controller for Studio page ** getStudio
exports.postStudio = (req, res, next) => {
    if (req.body.imgsrc) {
        const img = req.body.imgsrc;
        const userID = req.user;

        const image = new Image({
            userID : userID,
            image: img
        });

        image.save()
        .then(result => {
            res.redirect('/users/studio');
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        res.redirect('/users/studio');
    }
};

// Controller for Gallery page ** getGallery
exports.getGallery = (req, res) => 
res.render('user/gallery', {
    userName: req.user.name
});
