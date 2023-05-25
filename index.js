const express = require('express');
const mongoose = require('mongoose');
const PORT = 5000;
const userRoute = require('./routes/userRoutes')

const app = express();
app.use = (userRoute)
//const mongoDBConnectionStr = 'mongodb+srv://trading:trading@cluster0.pfcyujz.mongodb.net/google';
app.listen(PORT, () => {
    console.log('Server is Running on port 5000');
})