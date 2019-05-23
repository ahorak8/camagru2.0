const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema( {
    userId : {
        type: Schema.Types.ObjectId,
        ret: User,
        required: true
    },
    image : {
        type: String,
        required: true
    }
});

const User = mongoose.model('Images', ImageSchema);