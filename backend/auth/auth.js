const JWT = require("jsonwebtoken")
const {sendError} = require('../sendResponse')
const userModel = require("../models/userModel")
const auth=async(req,res,next)=>{ 
    try{
        const token = req.cookies.ZevonToken 
        const googleVerified = req.isAuthenticated() && req.user
        if(googleVerified){ 
            const user = await userModel.findOne({email:req.user})
            if(!user){
                return sendError(res,"Unauthorized user")
            }
            user.password = undefined;
            req.rootUser = user;
        }else if(token){
            const varifyToken = JWT.verify(token,process.env.JWT_KEY)
            if(!varifyToken.email){
                return sendError(res,"Unauthorized user")
            }
            const user = await userModel.findOne({email:varifyToken.email})
            if(!user){
                return sendError(res,"Unauthorized user")
            }
            user.password = undefined;
            req.rootUser = user;
        }else{
            return sendError(res, "Unauthorized user")
        }
         
    }catch(err){
        console.log(err)
        return sendError(res,"Authorization Failed!")
    }
    next()
}

module.exports = auth;