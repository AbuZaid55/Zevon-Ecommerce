const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const changePassSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
changePassSchema. index( { "createdAt": 1 }, { expireAfterSeconds: process.env.EXPIRE_TOKEN_TIME } );

changePassSchema.pre("save",async function(next){
    if(this.isModified("token")){
        const hashToken = await bcrypt.hash(this.token,10)
        this.token = hashToken
    }
    next()
})

changePassSchema.methods = {
    async compareToken(token){
        return await bcrypt.compare(token,this.token)
    }
}


module.exports = mongoose.model('changePas',changePassSchema)