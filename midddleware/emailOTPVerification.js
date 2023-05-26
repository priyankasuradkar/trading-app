const sgMail = require('@sendgrid/mail')
const user = require('../model/user')
require('dotenv').config()
const apiKey = process.env.apiKey

console.log('API KEY :::: ', apiKey);
const emailOTPVerification = (email) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const msg = {
        to: email,
        from: 'thebrewappsdev@gmail.com',
        subject: "OTP to your account",
        text: `Your OTP is : ${otp}`,
        html: `<p>Your OTP is :${otp}</p>`
    }

    sgMail.setApiKey(apiKey)
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