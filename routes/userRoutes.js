const express = require('express')
const route = express.Router()


const {
    signUp,
    login,
    otpVerification,
    forgotPassword,
    resendOTP,
    resetPassword,
    updateProfileDetails,
    getUserInfo
} = require('../controller/userController')

route.post('user/signup', signUp)
route.post('user/login', login)
route.post('user/otp-verification', otpVerification)
route.post('user/forgot-password', forgotPassword)
route.post('user/resend-otp', resendOTP)
route.post('user/reset-password', resetPassword)
route.post('user/update', updateProfileDetails)
route.post('user/get-info-info', getUserInfo)



module.exports = route
