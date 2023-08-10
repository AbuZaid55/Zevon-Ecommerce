const mongoose = require("mongoose")
const paymentSchema = mongoose.Schema({
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
    totalPaidAmount:{
        type:Number,
        required:true
    },
    razorpay_payment_id:{
        type:String,
        requried:true
    },
    razorpay_order_id:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

module.exports = mongoose.model("payment",paymentSchema)