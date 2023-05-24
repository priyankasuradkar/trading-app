const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    accessToken: {
        type: String
    }
    // any additional fields you want to store
});

module.exports = mongoose.model('User', UserSchema);