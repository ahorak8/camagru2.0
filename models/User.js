const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        required: true,
        unique: true
    },    
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const tokenSchema = new mongoose.Schema( {
    _userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 86400
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;