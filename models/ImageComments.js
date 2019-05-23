const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema ({
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

const User = mongoose.model('Comments', CommentsSchema);