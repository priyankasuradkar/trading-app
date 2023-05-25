const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    password: {
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
    },
    verificationCode: {
        type: Number
    }


});

module.exports = mongoose.model('User', UserSchema);