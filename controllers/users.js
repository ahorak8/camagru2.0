const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');
const Image = require('../models/image');
const Comment = require('../models/imageComment');

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

    console.log(emailNotifications);
    User.findOne({ email: oldEmail })
        .then(user => {
            if (!user) {
                req.flash('error', 'Please fill in your current email for confirmation');
            res.redirect('/users/my-account');
            return;
            }
            if (newName) {
                user.name = newName;
                req.flash('success_msg', 'Username is updated');
            }
            if (newEmail) {
                user.email = newEmail;
                req.flash('success_msg', 'Email is updated');
            }
            if (newPassword) {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) throw err;

                        newHashPassword = hash;
                        user.password = newHashPassword;
                        
                        user.save();
                        req.flash('success_msg', 'Password is updated');
                        res.redirect('/users/my-account');
                    }))
            }
            if (emailNotifications) {
                user.emailCommentNotification = true;

            }
            if (!emailNotifications) {
                user.emailCommentNotification = false;
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
    let currentPage
    if (req.params.page) {
        currentPage = Number(req.params.page);
    } else currentPage = 1;
    let thisUser;
    if (req.user) {
        thisUser = req.user.username;
    }
    else thisUser = false;

    Image.find()
    .then(images => {
        res.render('user/gallery', {
            images: images,
            id: images._id,
            userName: req.user.name,
            thisUser: thisUser,
            currentPage: currentPage,
            likes: images.likes
        });
    })
    .catch(err => {
        console.log(err);
    })
}

// Controller for Image ** getImage
exports.getImage = (req, res) => {
    const imageID = req.query.id;

    Image.find({ _id: imageID })
        .then(images => {
            Comment.find ({ imageID })
                .populate('userID')
                .exec()
                .then( comments => {
                    res.render('user/image', {
                        images: images,
                        likes: images.likes,
                        userName: req.user.name,
                        comments: comments
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => console.log(err));
}

// Controllers for Delete Image ** postDeleteImage
exports.postDeleteImage = (req, res, next) => {
    const imageID = req.body.imageID;

    // .remove is deprecated, should use .deleteOne (but it didn't work)
    Image.remove({ _id: imageID })
      .then(() => {
        req.flash('success_msg', 'Image Deleted!');
        res.redirect('/users/my-images');
      })
      .catch(err => console.log(err));
  };

  // Controller for Likes ** getLikes
  exports.postLike = (req, res) => {
      const imageID = req.body.imageID;

      Image.findOne({ _id: imageID })
      .then(image => {
          const likes = image.likes;
          image.likes = likes + 1;
          image.save();

          res.redirect('back');
      })
      .catch(err => {
          console.log(err);
      })
  }

// Controller for comment ** postComments
exports.postComments = (req, res) => {
    const comment = req.body.comment;
    const imageID = req.body.imageID;
    const userID = req.user._id;

    const newComment = new Comment({
        userID: userID,
        imageID: imageID,
        comment: comment
    })

    newComment.save(err => {
        console.log(err);
        var URL = '/users/image?id=' + imageID;
        res.redirect(URL);
    })
}

// Controller for Delete Account Handle **
exports.getDeleteAccount = (req, res) => {
    
}