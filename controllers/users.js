// Controller for My Account page ** getMyAccount
exports.getMyAccount = (req, res) =>
res.render('user/my-account', {
    userName: req.user.name,
    userEmail: req.user.email
});

// Controller for My Account Handle ** postMyAccount