const mongoose = require("mongoose")
const url = process.env.DB_URL
const dbConnection = ()=>{
    mongoose.connect(url).then(()=>{
        console.log("DB connection successfully")
    }).catch((err)=>{
        console.log("No connection ",err)
    })
}

module.exports=dbConnection