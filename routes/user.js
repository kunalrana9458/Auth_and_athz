const express=require("express")

const route = express.Router();

const {login,signup} = require("../controller/Auth");
const {auth,isStudent,isAdmin} = require("../middlewares/auth")

route.post("/login",login);
route.post("/signup",signup);


// route for test middleware
route.get("/test",auth,(req,res) => {
    res.json({
        sucess:true,
        message:"Testing successful"
    });
});

// protected route -: only authorized person can access
route.get("/student",auth,isStudent,(req,res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for student",
    })
})

route.get("/admin",auth,isAdmin,(req,res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for Admin",
    })
})

route.get('/getemail',auth,(req,res) => {
    // fetch id from payload as we use auth as middleware and it add payload in req
    const id = req.user._id;
    console.log("ID:",id);
})

module.exports = route;