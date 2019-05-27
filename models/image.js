const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema( {
    userID : {
        type: Schema.Types.ObjectId,
        ret: User,
        required: true
    },
    image : {
        type: String,
        required: true
    },
    likes: {
        type: number,
        default: 0
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;