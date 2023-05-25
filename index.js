const express = require('express');
const app = express();
const PORT = 5000;
require("./repo/mongoDBConfig")
const userRoute = require('./routes/userRoutes')
app.use = (userRoute)

app.listen(PORT, () => {
    console.log('Server is Running on port 5000');
})