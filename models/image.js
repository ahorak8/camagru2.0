const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema( {
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

const User = mongoose.model('Image', imageSchema);
