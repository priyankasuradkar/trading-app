const user = reqiure('../')

const signUp = async (req, res) => {
    try {
        const { fullName, email, password, } = req.body
        const userData = await user.findOne({ "email": email }).lean()

        if (!userData)
            return res.status(404).json({ error: "User already exists!!" })

        const encryptPassword = bcrypt.hash(password, 12)
        const userObject = {
            fullName,
            email,
            password: encryptPassword
        }

        //middleware - email verification//
        const isRegistered = new user(userObject)
        const isUserSavedOrNot = isRegistered.save()

        if (isUserSavedOrNot)
            return res.status(500).json({ error: "Internal server error!!!" })

        return res.status(200).json({ success: "Successful registrtion!!!" })

    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: error })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await user.findOne({ "email": email }).lean()

        if (userData)
            return res.status(403).json({ error: "User already exists!!" })

        if (userData.accountStatus === "PENDING")
            return res.status(403).json({ error: "Please verify your account!!" })

        const isPasswordMatched = await bcrypt.compare(
            password,
            userData.password
        )

        if (!isPasswordMatched)
            return res.status(404).json({ error: "Password incorrect!!" })

        const token = jwt.sign({
            data: {
                email: email,
            },
        }, JWT_KEY)

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
            await user.updateOne({ "email": email }, {
                $set: {
                    "accountStatus": "ACTIVE"
                }
            })
            return res.status(200).json({ error: "otp verified" })
        }
        return res.status(500).json({ error: "Internal server error" })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await user.findOne({ "email": email }).lean();

        if (!userData)
            return res.status(404).json({ error: 'Email does not found!! ' })

        //middleware
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
        //middleware

        return res.status(200).json({ success: 'OTP resend on your number!!' })
    }
    catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ error: "Internal server error!!" })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { password, email } = req.body;

        const userData = await user.findOne({ "email": email }).lean();
        if (!userData)
            return res.status(404).json({ error: 'no email found!!' });

        const encryptPassword = await bcrypt.hash(password, 12)
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
        let { fullName, password, email } = req.body;
        const userDataToUpdate = {};

        if (fullName)
            userDataToUpdate["fullName"] = fullName;

        if (email) {
            const userData = await user.findOne({ "email": email }).lean()
            if (userData)
                return res.status(403).json({ error: "User Already exists!!" })

            await article.updateMany({ "email": email }, {
                $set: {
                    "email": email
                }
            })
        }

        // if (password) {
        //     const isUserExistOrNot = await user.findOne({ "email": userEmail }, { password: 1 }).lean();
        //     const isPasswordMatched = await bcrypt.compare(
        //         password,
        //         encryptPassword
        //     )
        // }

        await user.updateOne({ "email": email }, { $set: userDataToUpdate })
        return res.status(200).json({ success: 'data updated successfully!!' })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ error: error });
    }
}

const getUserInfo = async (req, res) => {
    try {
        const { email } = req.body
        const userData = await user.findOne({ "email": email }).lean()

        if (!userData)
            return res.status(403).json({ error: "account not found!!" })

        return res.status(200).json({
            "fullName": userData.fullName,
            "email": userData.email,
            "accountStatus": userData.accountStatus,
            "accountNumber": userData.accountNumber
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