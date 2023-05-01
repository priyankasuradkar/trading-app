const mongoose = require('mongoose')

const userSchema = new mongoose.userSchema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profilePicture: {
        type: String
    },
    accountNumber: {
        type: String
    },
    accountStatus: {
        type: String,
        default: "PENDING"
    },
    verificationCode: {
        type: Number
    }
})

const user = mongoose.model("user", userSchema)
module.exports = user