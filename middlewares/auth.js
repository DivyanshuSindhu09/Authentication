// auth, isStudent, isAdmin

const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.auth = (req, res, next) => {
    try {
        // extract jwt token
        const token = req.body.token
        if(!token){
            return res.status(401).json({
                success : false,
                message : 'User in not registered'
            })
        }
        // verify token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload)
            req.user = payload
        } catch (error) {
             return res.status(401).json({
                success : false,
                message : 'Invalid token'
            })
        }
// agle middleware pe chalo
    next()
    } catch (error) {
        console.log(error)
         return res.status(401).json({
                success : false,
                message : 'Something went wrong'
            })
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role !== 'User'){
            return res.status(401).json({
                success : false,
                message : 'Protected route for User'
            })
        }
        next()
    } catch (error) {
          return res.status(500).json({
                success : false,
                message : 'Something went wrong'
            })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                success : false,
                message : 'Protected route for Admin'
            })
        }
        next()
    } catch (error) {
          return res.status(500).json({
                success : false,
                message : 'Something went wrong'
            })
    }
}