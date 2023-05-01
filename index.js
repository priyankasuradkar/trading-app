const express = require('express')
const mongoose = require('mongoose')
const PORT = 3008

const app = express();

app.use(express.json())

app.listen(PORT, () => {
    console.log("Server is running:: ", PORT)
})