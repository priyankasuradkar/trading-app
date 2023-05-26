const user = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/prod')
const userVerification = require('../midddleware/userVerification')

const emailOTPVerification = require('../midddleware/emailOTPVerification');
const forgetPasswordOTPSender = require('../midddleware/forgetPasswordOTPSender');
//const moment = require('moment')
require('dotenv').config

const signUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        console.log("#####", fullName, email, password)
        const userData = await user.findOne({ "email": email }).lean()
        console.log("####", userData)

        if (userData)
            return res.status(404).json({ error: "User already exists!!" })

        const encryptPassword = await bcrypt.hash(password, 12)

        const userObject = {
            fullName,
            email,
            password: encryptPassword
        }

        //middleware - email verification//
        emailOTPVerification(email)
        const isUserRegistered = new user(userObject)
        const isUserSavedOrNot = isUserRegistered.save()
        //console.log("#######", isUserSavedOrNot)

        if (!isUserSavedOrNot)
            return res.status(500).json({ error: "Internal server error!!!" })

        return res.status(200).json({ success: "Successfull registration!!!" })

    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: error })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("########", email, password)
        const userData = await user.findOne({ "email": email }).lean()
        console.log("########", userData)

        if (!userData)
            return res.status(403).json({ error: "Account not found!!" })

        if (userData.accountStatus === "PENDING")
            return res.status(403).json({ error: "Please verify your account!!" })

        const isPasswordMatched = bcrypt.compare(
            password,
            userData.password
        )
        console.log("########", isPasswordMatched)
        if (!isPasswordMatched)
            return res.status(404).json({ error: "Password incorrect!!" })

        const token = jwt.sign({
            data: {
                email: email,
            },
        }, JWT_KEY)

        console.log("TOKEN::", token)
        return res.status(200).json({
            token,
            email: userData.email
        })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}

const otpVerification = async (req, res) => {
    try {
        const { email, otp } = req.body
        const userData = await user.findOne({ "email": email }).lean()


        if (!userData)
            return res.status(403).json({ error: "User already exists!!" })

        if (otp === userData.verificationCode) {
            const updatedStatus = await user.updateOne({ "email": email }, {
                $set: { "accountStatus": "ACTIVE" }
            })
            console.log("@##########", updatedStatus)
            return res.status(200).json({ success: "otp verified" })
        }

        return res.status(500).json({ error: "Incorrect otp" })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: error })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("###########", email)
        const userData = await user.findOne({ "email": email }).lean();

        if (!userData)
            return res.status(404).json({ error: 'Email does not found!! ' })

        //middleware
        forgetPasswordOTPSender(email)
        return res.status(200).json({ success: "link sent to your email " })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body
        forgetPasswordOTPSender(email)
        return res.status(200).json({ success: 'OTP resend on your email!!' })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword, email } = req.body;

        const userData = await user.findOne({ "email": email }).lean();
        if (!userData)
            return res.status(404).json({ error: 'No user found!!' });

        if (!(newPassword === confirmPassword))
            return res.status(404).json({ error: "password should equal to confirm password!!" })

        const encryptPassword = await bcrypt.hash(newPassword, 12)
        const updatedPassword = await user.updateOne({ "email": email }, {
            $set: {
                "password": encryptPassword
            }
        })
        return res.status(200).json({ success: "password reset successfully" })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}

const updateProfileDetails = async (req, res) => {
    try {
        let { fullName, email, newEmail } = req.body;
        const userDataToUpdate = {};

        if (fullName) {
            console.log("##FULLNAME::", fullName)
            userDataToUpdate["fullName"] = fullName;
            console.log("#########", fullName)
        }

        if (newEmail) {
            const userData = await user.findOne({ "email": email }).lean()
            if (!userData)
                return res.status(403).json({ error: "Account not found!!" })

            userDataToUpdate["email"] = newEmail
            console.log("########", email)

        }

        console.log('###############', userDataToUpdate);
        const update = await user.updateOne({ "email": email }, { $set: userDataToUpdate })
        console.log("#########", update)
        return res.status(200).json({ success: 'data updated successfully!!' })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ error: error });
    }
}

const getUserInfo = async (req, res) => {
    try {
        //const { email } = req.params
        const email = req.user.email
        console.log("#######", email)
        const userData = await user.findOne({ "email": email }).lean()
        //console.log("########", email, userData)

        if (!userData)
            return res.status(403).json({ error: "account not found!!" })
        console.log("########", userData.accountStatus)
        return res.status(200).json({
            "fullName": userData.fullName,
            "email": userData.email,
            "accountStatus": userData.accountStatus,
        })

    }
    catch (error) {
        console.log("error", error)
        return res.status(500).json({ error: error });
    }
}



module.exports = {
    signUp,
    login,
    otpVerification,
    forgotPassword,
    resendOTP,
    resetPassword,
    updateProfileDetails,
    getUserInfo



}