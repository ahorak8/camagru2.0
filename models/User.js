const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        required: true,
    },    
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpires: {
        type: Date
    },
    verifyToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    emailCommentNotification : {
        type: Boolean,
        default: true
    }
});

// const tokenSchema = new mongoose.Schema( {
//     _userID: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     },
//     token: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         required: true,
//         default: Date.now,
//         expires: 86400
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;