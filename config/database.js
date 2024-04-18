const mongoose = require("mongoose")

require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => {
        console.log("Issuee in DB Connection");
        console.error(err);
        process.exit(1);
    })
}