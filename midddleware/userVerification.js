const jwt = require("jsonwebtoken");
const user = require('../model/user');
const { JWT_KEY } = require("../config/prod");


module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ error: "Unauthorized User" });

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_KEY, async (error, payload) => {
        if (error)
            return res.status(401).json({ error: "Unauthorized User" });

        const { email } = payload.data;
        let userDBResult = await user.findOne({ "email": email, "accountStatus": "ACTIVE" }).lean();
        // if (!userDBResult) 
        //     userDBResult = await admin.findOne({ "email": email, "adminAccountStatus": "ACTIVE" }).lean();
        if (!userDBResult)
            return res.status(401).json({ error: "Unauthorized User" });


        req.user = userDBResult;
        next();
    });
};