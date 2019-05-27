const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    userID : {
        type: Schema.Types.ObjectId,
        ret: User,
        required: true
    },
    imageID : {
        type: Schema.Types.ObjectId,
        ret: Images,
        required: true
    },
    comment : {
        type: String,
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;