const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
class MongoDB {
    constructor() {
        if (!MongoDB.instance) {
            mongoose.connect(
                MONGO_URI,
                (error) => {
                    if (error) {
                        console.log(`Connection Failed with MongoDB`);
                        console.log(`${error}`);
                    } else {
                        console.log(`Connected to MongoDB`);
                        console.log(`${MONGO_URI}`);
                    }
                }
            );
        }
    }
}

const mongoDB = new MongoDB();
Object.freeze(mongoDB);
module.exports = { mongoDB };