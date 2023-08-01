const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    phoneNo:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    totalAmount:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
})