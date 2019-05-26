const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    userId : {
        type: Schema.Types.ObjectId,
        ret: User,
        required: true
    },
    imageId : {
        type: Schema.Types.ObjectId,
        ret: Images,
        required: true
    },
    comment : {
        type: String,
        required: true
    }
});

const User = mongoose.model('Comment', commentSchema);