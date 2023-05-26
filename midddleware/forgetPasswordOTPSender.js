const sgMail = require('@sendgrid/mail')
const user = require('../model/user')
require('dotenv').config
const apiKey = process.env.apiKey

const forgetPasswordOTPSender = (email) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const message = {

        to: email,
        from: 'thebrewappsdev@gmail.com',
        subject: 'OTP to your account',
        text: `Your otp is ${otp}`,
        html: `<p>Your otp is : ${otp}</p> `
    }

    sgMail.setApiKey(apiKey)
    sgMail.send(message)
        .then(async () => {
            await user.updateOne({ "email": email }, {
                $set: {
                    "verificationCode": otp
                }
            })
            return 1
        })

}

module.exports = forgetPasswordOTPSender