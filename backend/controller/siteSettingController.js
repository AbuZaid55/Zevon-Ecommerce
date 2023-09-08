const {sendError, sendSuccess }= require('../sendResponse')
const siteSettingModel = require('../models/siteSettingModel')
const validator = require("email-validator")
const fs = require("fs/promises")
const cloudinary = require('cloudinary')

const siteInformation = async(req,res)=>{
    if(req.fileError){
        return sendError(res,req.fileError)
    }
    try {
        const {sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow}=req.body
        const banner = (req.files && req.files["banner"])?req.files["banner"]:[]
        
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
                let public_id = []
                let secure_url = []
                for(const file of banner){
                    const result = await cloudinary.v2.uploader.upload(file.path,{folder:'ZevonBanner'})
                    if(result){
                        public_id.push(result.public_id)
                        secure_url.push(result.secure_url)
                    }
                    fs.rm(file.path)
                }
                await siteSettingModel({sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow,'banner.public_id':public_id,'banner.secure_url':secure_url}).save()
                return sendSuccess(res,"Data uploaded successfully")
            }
        }
        else{
            if(banner.length==0){
                await siteSettingModel.updateOne({_id:data[0]._id},{$set:{sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow}})
            }else{
               if(data[0].banner.public_id.length!=0){
                data[0].banner.public_id.map(async(public_id)=>{
                    await cloudinary.uploader.destroy(public_id)
                })
               }
                let public_id = []
                let secure_url = []
                for(const file of banner){
                    const result = await cloudinary.v2.uploader.upload(file.path,{folder:'ZevonBanner'})
                    if(result){
                        public_id.push(result.public_id)
                        secure_url.push(result.secure_url)
                    }
                    fs.rm(file.path)
                }
                await siteSettingModel.updateOne({_id:data[0]._id},{$set:{sliderItemNo,productPageItemNo,office,email,phoneNo,instaLink,linkedInLink,discordLink,githubLink,noOfRow,'banner.public_id':public_id,'banner.secure_url':secure_url}})
            }
            return sendSuccess(res,"Settings Changed Successfully")
        }
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
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