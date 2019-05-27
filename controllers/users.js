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
    let errors = [];

    
};

// Controller for Studio page ** getStudio
exports.getStudio = (req, res) =>
res.render('user/studio', {
    userName: req.user.name
});

// Controller for Gallery page ** getGallery
exports.getGallery = (req, res) => 
res.render('user/gallery', {
    userName: req.user.name
});
