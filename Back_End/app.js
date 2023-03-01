const express=require('express')
const fs = require('fs')
const cors = require("cors");
const userManagementRoute = require('./route/userManagementRoute')
const app = express()
//below cors are used for all routs with all origin request
app.use(cors())
app.use(express.json()) 
app.use('/user', userManagementRoute)
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})