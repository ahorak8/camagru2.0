const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');
const Image = require('../models/image');

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
    const { oldEmail, newName, newEmail, newPassword, emailNotifications } = req.body;

    User.findOne({ email: oldEmail })
        .then(user => {
            if (!user) {
                console.log("Email incorrect");
            }
            if (newName) {
                user.name = newName;
                req.flash('success_msg', 'Username is updated');
            }
            if (newEmail) {
                user.email = newEmail;
                console.log("Email updated");
            }
            if (newPassword) {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) throw err;

                        newHashPassword = hash;
                        user.password = newHashPassword;
                        user.save();
                    }))
            }

            user.save();
            req.flash('success_msg', 'Account Details Updated!');
            res.redirect('/users/my-account');
        })
        .catch(err => console.log(err));
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

// Controller for My Images page ** getMyImages
exports.getMyImages = (req, res, next) => {
    Image.find({ userID: req.user._id})
    .then(images => {
        res.render('user/my-images', {
            images: images,
            userName: req.user.name
        });
    })
    .catch(err => {
        console.log(err);
    });
};

// Controller for Gallery page ** getGallery
exports.getGallery = (req, res) => {
    res.render('user/gallery', {
        userName: req.user.name
    })
}


// Controllers for Delete Image ** postDeleteImage
exports.postDeleteImage = (req, res, next) => {
    const imageId = req.body.imageId;
    console.log(imageId);

    // .remove is deprecated, should use .deleteOne (but it didn't work)
    Image.remove({ _id: imageId })
      .then(() => {
        console.log('Image Deleted!');
        res.redirect('/users/my-images');
      })
      .catch(err => console.log(err));
  };

// Controller for Delete Account Handle **
exports.getDeleteAccount = (req, res) => {
    
}