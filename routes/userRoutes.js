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

route.post('/user/signup', signUp)
route.post('/user/login', login)
route.post('/user/otp-verify', otpVerification)
route.post('/user/forgot', forgotPassword)
route.post('/user/resend-otp', resendOTP)
route.patch('/user/reset', resetPassword)
route.patch('/user/update', updateProfileDetails)
route.get('/user/get-user-info', getUserInfo)



module.exports = route
