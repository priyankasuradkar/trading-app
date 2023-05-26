const express = require('express')
const route = express.Router()
//const userVerification = require('../midddleware/userVerification')

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
const emailOTPVerification = require('../midddleware/emailOTPVerification')
const userVerification = require('../midddleware/userVerification')

route.post('/user/signup', signUp)
route.post('/user/login', login)
route.post('/user/otp-verify', otpVerification)
route.post('/user/forgot', forgotPassword)
route.post('/user/resend-otp', resendOTP)
route.patch('/user/reset', resetPassword)
route.patch('/user/update', updateProfileDetails)
route.get('/user/get-user-info', userVerification, getUserInfo)



module.exports = route
