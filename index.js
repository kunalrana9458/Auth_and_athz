const express=require("express")
const app=express();
const cookieParser = require("cookie-parser")

require('dotenv').config();

const PORT=process.env.PORT || 3000;

// cookie-parser - what is this and why we need this
app.use(cookieParser());
app.use(express.json());

require("./config/database").dbConnect();

// route import and mount
const user = require("./routes/user")
app.use("/api/v1",user)

app.listen(PORT,() => {
    console.log(`App is Listening at ${PORT}`);
})

app.get("/",(req,res) => {
    res.send("<h1>This is a homepage</h1>")
})

// cookie-parese read what is it ...