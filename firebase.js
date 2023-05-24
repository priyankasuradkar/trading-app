// Initialize Firebase
const admin = require('firebase-admin');

const serviceAccount = require('./trading-app-privatekey-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "mongodb+srv://trading:trading@cluster0.pfcyujz.mongodb.net/trading"
});
const auth = admin.auth();

module.exports = auth
