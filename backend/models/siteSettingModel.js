const mongoose = require("mongoose")
const settingSchema = mongoose.Schema(({
    sliderItemNo:{
        type:Number,
        required:true,
    },
    banner:[
        {
            type:String,
            required:true
        }
    ],
    productPageItemNo:{
        type:Number,
        required:true
    },
    office:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNo:{
        type:Number,
        required:true
    },
    instaLink:{
        type:String,
    },
    linkedInLink:{
        type:String,
    },
    discordLink:{
        type:String,
    },
    githubLink:{
        type:String,
    },
    noOfRow:{
        type:Number,
        required:true
    },
}))

module.exports = mongoose.model("siteSetting",settingSchema)