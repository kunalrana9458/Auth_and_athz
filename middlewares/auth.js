// middleware to check authenciation , isStudent , isAdmin to check authorization

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) => {
    try{
        // extract jwt token from req body 
        // other ways are also available to fetch token -: cookies,header,req body

        console.log("Cookie:",req.cookies.token);
        console.log("body:",req.body.token);
        console.log("header:",req.header("Authorization"))

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token || token === undefined){
            return res.status({ 
                success:false,
                message:"Token Missing"
            });
        }

        // now verrify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.user = decode;
        } catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:true,
            message:"Something went wrong, while verifying user"
        })
    }
}

exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for student"
            });
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"User Role is not matching"
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for admin"
            });
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"User Role is not matching"
        })
    }
}