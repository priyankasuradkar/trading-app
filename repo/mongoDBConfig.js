const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", false);

console.log('##############', MONGO_URI);
class MongoDB {
    constructor() {
        if (!MongoDB.instance) {
            mongoose.connect(MONGO_URI)
        }
    }
}

const mongoDB = new MongoDB();
Object.freeze(mongoDB);
module.exports = { mongoDB };