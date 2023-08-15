const {sendError, sendSuccess }= require('../sendResponse')
const siteSettingModel = require('../models/siteSettingModel')
const validator = require("email-validator")
const fs = require("fs")


const siteInformation = async(req,res)=>{
    try {
        const {sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow}=req.body
        const bann = (req.files && req.files["banner"])?req.files["banner"]:[]
        const banner = []
        bann.map((img)=>{ banner.push(img.filename)})
        
        if(sliderItemNo==='' || sliderItemNo===0 || productPageItemNo==='' || productPageItemNo===0 || office==='' || email==='' || phoneNo==='' || noOfRow==='' || noOfRow===0){
            return sendError(res,"Please enter all required filed!")
        }
        if(!validator.validate(email)){
            return sendError(res,"Invalid Email!")
        }

        const data = await siteSettingModel.find({})
        if(data.length==0){
            if(banner.length==0){
                return sendError(res,"Please Select Banner!")
            }else{
                await siteSettingModel({sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow,banner}).save()
                return sendSuccess(res,"Data uploaded successfully")
            }
        }else{
            if(banner.length==0){
                await siteSettingModel.updateOne({_id:data[0]._id},{$set:{sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow}})
            }else{
                try {
                    data[0].banner.map((img)=>{
                        fs.unlinkSync(`./Images/${img}`)
                    })
                } catch (error) {
                }
                await siteSettingModel.updateOne({_id:data[0]._id},{$set:{sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow,banner}})
            }
            return sendSuccess(res,"Settings Changed Successfully")
        }
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
    console.log("asdf")
}


const getSiteSettings = async(req,res)=>{
    try {
       const data = await siteSettingModel.find() 
       if(!data){
        return sendError(res,"Setting data not Found")
       }
       sendSuccess(res,"Site settings",data[0])
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
module.exports = {
    siteInformation,
    getSiteSettings
}