const sgMail = require('@sendgrid/mail')
const user = require('../model/user')
require('dotenv').config()
const apikey = process.env.apikey

//console.log('API KEY :::: ', apikey);
const emailOTPVerification = (email) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const msg = {
        to: email,
        from: 'azadsingh42878@gmail.com',
        subject: "OTP to your account",
        text: `Your OTP is : ${otp}`,
        html: `<p>Your OTP is :${otp}</p>`
    }

    sgMail.setApiKey(apikey)
    sgMail.send(msg)
        .then(async () => {
            await user.updateOne({ "email": email }, {
                $set: {
                    "verificationCode": otp
                }
            })
            return 1
        })
        .catch((error) => {
            console.log('Error:', error.toString());
            return 0
        });

}

module.exports = emailOTPVerification