const Image = require('../models/image');

exports.getGuestGallery = (req, res, next) => {
    Image.find()
    .then(images => {
        res.render('guest/gallery', {
            images: images,
            // userName: req.user.name
        });
    })
    .catch(err => {
        console.log(err);
    });
};

