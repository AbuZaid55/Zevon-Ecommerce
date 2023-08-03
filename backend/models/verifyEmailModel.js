const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const verifyEmailSchema =  new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})
verifyEmailSchema.index({ createdAt: 1 }, { expires: Number(process.env.EXPIRE_TOKEN_TIME ) })

verifyEmailSchema.pre('save',async function(next){
    if(this.isModified("otp")){
        const hashOtp = await bcrypt.hash(this.otp,8)
        this.otp = hashOtp
    }
    next()
})

verifyEmailSchema.methods ={
    async compareOtp(otp){
        return bcrypt.compare(otp,this.otp)
    }
}

module.exports = mongoose.model("verifyEmail",verifyEmailSchema)