// bcrypt - used for hashing passwords

const bcrypt = require('bcrypt')
const User = require('../models/User')
const  jwt = require('jsonwebtoken')

require('dotenv').config()

exports.signup = async (req, res) => {
    try {
        // get data
        const {name, email, password, role} = req.body
        // check if user exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : 'User Already Exists'
            })}
     
      // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch(err){
            return res.status(500).json({
                success : false,
                message : 'Error in hashing password'
            })
        }

    // create entry for new user
        let user = await User.create({
            name, email, password : hashedPassword, role
        })
    return res.status(200).json({
        success : true,
        message : 'User Created Successfully'
    })
            
    } catch (error) {
        console.log("Error")
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'An error occured'
        })
    }
}

// login 

exports.login = async (req, res) => {
    try {
    // get data
        const {email, password} = req.body
    // no data
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : 'Please Fill All The Details Carefully'
        })
    }

    // checking for registered user

    const user = await User.findOne({email})

    // if not a registered user
    if(!user){
        return res.status(401).json({
            success : false,
            message : 'user does not exists'
        })
    }

    // verify password 

    const payload = {
        email : user.email,
        id : user._id,
        role : user.role
    }

    if(await bcrypt.compare(password, user.password)){
    // correct password
        let token = jwt.sign(payload,
                            process.env.JWT_SECRET,
                            {
                                expiresIn : '2h'
                            })

        // user = user.toObject()
        user.token = token
        user.password = undefined

        const options = {
            expires : new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ),
            httpOnly : true 
        }
    // creating cookie - 3 params name, data & few options
        res.cookie('token', token, options).status(200).json({
            success : true,
            message  : 'User Logged In Successfully',
            token,
            user
        })
    }else{
    // wrong password
    return res.status(400).json({
        success : false,
        message : 'Invalid Password'
    })
    }

    } catch (error) {
        console.log("Error")
        console.log(error)
        return res.status(500).json({
            success :false,
            message : 'An Error Occured'
        })
    }
}