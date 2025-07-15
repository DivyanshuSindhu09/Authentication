const express = require('express')
const router = express.Router()

const {login, signup} = require('../Controllers/Auth')
const {auth, isStudent, isAdmin} = require('../middlewares/auth')

router.post('/login', login)
router.post('/signup', signup)

router.get('/test', auth, (req, res)=> {
    res.status(200).json({
        success : true,
        message : "Welcome to the test portal"
    })
})



// Protected routes

router.get('/student', auth, isStudent , (req, res)=> {
    res.status(200).json({
        success : true,
        message : "Welcome to the student's portal"
    })
})

router.get('/admin', auth, isAdmin , (req, res)=> {
    res.status(200).json({
        success : true,
        message : "Welcome to the admin's portal"
    })
})


module.exports = router