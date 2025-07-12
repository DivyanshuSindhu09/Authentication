const express = require('express')
const app = express()

// load config from .env file
require('dotenv').config()
const PORT = process.env.PORT || 4000

// middleware for parsing 
app.use(express.json())

require('./config/database').connect()

// importing routes and mounting
const user = require('./routes/user')
app.use('/api/v1', user)

// activating server

app.listen(PORT, ()=>{
    console.log(`APP IS STARTED AT ${PORT}`)
})