// bcrypt - used for hashing passwords

const bcrypt = require('bcrypt')
const User = require('../models/User')

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
        const user = await User.create({
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