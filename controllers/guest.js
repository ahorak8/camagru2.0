const Image = require('../models/image');

exports.getGuestGallery = (req, res, next) => {
    let currentPage
    if (req.params.page) {
        currentPage = Number(req,params.page);
    } else currentPage = 1;

    Image.find()
        .populate('userID')
        .exec()
        .then(images => {
            res.render('guest/gallery', {
                images: images,
                currentPage: currentPage
                // userName: req.user.name
            });
        })
        .catch(err => {
            console.log(err);
        });
};

