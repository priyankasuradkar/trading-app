const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/prod");
const User = require("../model/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Unauthorized User" });
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized User" });
        }

        const { email } = payload.data;
        const userDBResult = await User.findOne({ "email": email }).lean();
        if (!userDBResult) {
            return res.status(401).json({ error: "Unauthorized User" });
        }

        req.user = userDBResult;
        next();
    });
};