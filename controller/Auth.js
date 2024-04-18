const bcrypt = require("bcrypt");
const User = require("../models/User")
const jwt = require("jsonwebtoken");
require("dotenv").config();

// sign up handler - controller
exports.signup = async(req,res) => {
    try{
        // get data from req
        const {name,email,password,role} = req.body;
        // check if already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exist",
            });
        }
        // secure the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in Encrypting Password",
            });
        }

        // create entry of a user in DB
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:true,
            message:"User cannot be registered ,Please try again",
        })
    }
}


exports.login = async(req,res) => {
    try{
        // data fetched 
        const {email,password} = req.body;
        // validation for email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all details"
            });
        }
        // check is already registered or not
        let user = await User.findOne({email});
        // if not a registered user
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not registered please sign up!"
            });
        }
        // create payload for jwt token
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        // verify password and generate a JWT Token
        if(await bcrypt.compare(password,user.password)){
            // password match then create jwt token
            let token = jwt.sign(payload,process.env.JWT_SECRET,
            {
                expiresIn:"2h",
            });
            user=user.toObject(); // why we need the user to convert it into the object
            user.token = token; // create new entry of token this entry is not created in database
            user.password = undefined; // only undefined only from user object not from database
            const options = {
                expires:new Date(Date.now() + 30000),
                httpOnly:true,
            }
            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"User Logged in Successfully"
            // });

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in Successfully"
            });
        }
        else{
            // password dont match
            return res.status(402).json({
                success:false,
                message:"Password Wrong"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Login Failure",
        })
    }
}