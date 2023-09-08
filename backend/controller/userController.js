const userModel = require("../models/userModel")
const verifyEmailModel = require("../models/verifyEmailModel")
const changePassModel = require('../models/changePassModel')
const {sendError,sendSuccess}=require('../sendResponse')
const validator = require("email-validator")
const generateOtp = require('../utils/generateOtp')
const {otpMail,greetingMail,linkSendMail,contactMail} = require('../utils/mail')
const JWT = require("jsonwebtoken")
const fs = require("fs/promises")
const productModel = require("../models/productModel")
const cloudinary = require('cloudinary')

const user = (req,res)=>{
    sendSuccess(res,"Hello User",req.rootUser)
}

const allUser = async(req,res)=>{
    try {
        const allUser = await userModel.find()
        sendSuccess(res,"All Users",allUser)
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}

const signUp = async(req,res)=>{
    try {
        const {name,email,password,confirm_pass}=req.body 
        if(name=='' || email=='' || password=='' || confirm_pass==''){
            return sendError(res,"All field are required")
        }else if(!validator.validate(email)){
            return sendError(res,"Invalid Email")
        }else if(password.length<8 || password.length>12){
            return sendError(res,"Your password should be between 8 to 12 character")
        }else if(password!= confirm_pass){
            return sendError(res,"Password and confirm password does not match")
        }
        const isExist = await userModel.findOne({email:email})
        if(isExist){
            return sendError(res,"Email already exists")
        }
        const user = await userModel(req.body)
        
        const OTP = generateOtp()
        await verifyEmailModel({owner:user._id,otp:OTP}).save()
        await user.save()
        user.password=undefined
        otpMail(user.email,OTP) 
        sendSuccess(res,"Otp has been send to your email id",user)
    } catch (error) {
        console.log(error)
        sendError(res,"Sign Up Failed")
    }
}

const verifyEmail = async(req,res)=>{
    try {
        const {userId,otp}=req.body
        if(userId==''){
            return sendError(res,"Invalid User")
        }
        if(otp==''){
            return sendError(res,"Please Enter OTP")
        }
        const user = await userModel.findOne({_id:userId})
        if(!user){
            return sendError(res,"Invalid User")
        }
        if(user.validated){
            return sendError(res,"This account is already verified!")
        }
        
        const verifyEmailData = await verifyEmailModel.findOne({owner:userId})
        if(!verifyEmailData){
            return sendError(res,"OTP has expired!")
        }
        const verifyOtp = await verifyEmailData.compareOtp(otp)
        if(!verifyOtp){
            return sendError(res,"Please provied a valid OTP")
        }
        user.validated = true
        await verifyEmailModel.findByIdAndDelete(verifyEmailData._id)
        await user.save()

        greetingMail(user.email,"Your account has been verfied.")
        sendSuccess(res,"Your account has been verified.")
    } catch (error) {
        sendError(res,"Verification Failed")
    }
}

const resentVerificatonCode = async(req,res)=>{
    try {
        const {userId} = req.body
        if(userId==''){
            return sendError(res,"Enter User Id")
        }
        const user = await userModel.findOne({_id:userId})
        if(!user){
            return sendError(res,"Sorry, User not found!")
        }
        if(user.validated){
            return sendError(res,"User already verified!")
        }
        const verifiyEmailData = await verifyEmailModel.findOne({owner:user._id})
        if(verifiyEmailData){
            return sendError(res,"OTP already has sent!")
        }

        const OTP = generateOtp()
        await verifyEmailModel({owner:user._id,otp:OTP}).save() 
        otpMail(user.email,OTP)
        
        sendSuccess(res,"OTP sent successfull to your email id")
   } catch (error) {
    sendError(res,"Resend Verification code Failed!")
   }
}

const logIn = async(req,res)=>{
    try {
        const {email,password}=req.body
        if(email==''|| password==''){
            return sendError(res,"All field are required!")
        }
        if(!validator.validate(email)){
            return sendError(res,"Invalid Email!")
        }
        const user = await userModel.findOne({email:email})
        if(!user){
            return sendError(res,"Invalid Email or Password!")
        }
        const verifyPass = await user.comparePass(password)
        if(!verifyPass){
            return sendError(res,"Invalid Email or Password")
        }
        user.password = undefined
        const token = user.generateToken()
        res.cookie('ZevonToken',token,{
            expires:new Date(Date.now() + Number(process.env.EXPIRE_COOKIE_TIME)),
            httpOnly:true
        })
        if(!user.validated){
            const sendOtp = await verifyEmailModel.findOne({owner:user._id}) 
            if(!sendOtp){
                const OTP = generateOtp()
                await verifyEmailModel({owner:user._id,otp:OTP}).save()
                otpMail(user.email,OTP)
            }
            return sendSuccess(res,"!verified",user)
        }
        sendSuccess(res,"You are login successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"Login Failed!")
    }
}


const sendResetLink = async(req,res)=>{
    try {
         const { email } = req.body
         if(email==''){
             return sendError(res,"Enter Email Id")
         }
         if(!validator.validate(email)){
             return sendError(res,"Invalid Email Id")
         }
         const user  = await userModel.findOne({email:email})
         if(!user){
             return sendError(res,"Sorry, User not found!")
         }
         const alreadySend = await changePassModel.findOne({owner:user._id})
         if(alreadySend){
             return sendError(res,"Reset Link already send") 
         }
 
         const token = JWT.sign({_id:user._id,email:user.email},process.env.JWT_KEY)
         const result =  changePassModel({owner:user._id,token:token})
         await result.save()
 
         linkSendMail(user.email,`${process.env.FRONTEND_URL}/changepass?token=${token}&id=${user._id}`)
         sendSuccess(res,"Reset link sent successfull to your email id")
    } catch (error) {
        console.log(error)
     sendError(res,"send Reset Link Failed!")
    }
 }

 const changePass = async(req,res)=>{
    try {
        const {token, userId, new_pass, confirm_pass} = req.body
        if(token=='' || userId=='' || new_pass=='' || confirm_pass==''){   
            return sendError(res,"All field are required!")
        }
        if(new_pass.length < 8 || new_pass.length > 12){
            return sendError(res,"Your password should be between 8 to 12 character")
        }
        if(new_pass != confirm_pass){
            return sendError(res,"password and confirm password does not match")
        } 
        const user = await userModel.findOne({_id:userId})
        if(!user){
            return sendError(res,"Sorry, User not found!")
        }
        const changePassData = await changePassModel.findOne({owner:user.id})
        if(!changePassData){
            return sendError(res,"Invalid token or userId")
        }
        const isMatch = await changePassData.compareToken(token)
        if(!isMatch){
            return sendError(res,"Invaild token")
        }
        const comparePass = await user.comparePass(new_pass)
        if(comparePass){
            return sendError(res,"The new password must be different from the old password!")
        }
        user.password = new_pass
        await changePassModel.findByIdAndDelete(changePassData._id)
        await user.save()
        greetingMail(user.email,"Your password has been changed.")
        sendSuccess(res,"Your password has been changed.")
    } catch (error) {
        console.log(error)
        sendError(res,"Change Password Failed!")
    }
}

const uploadProfile = async(req,res)=>{
    if(req.fileError){
        return sendError(res,req.fileError)
    }
    try {
        const _id = (req.body && req.body._id)?req.body._id:''
        const profile = (req.file && req.file.filename)?req.file.filename:''
        if(profile===''){
            return sendError(res,"Please select profile pic!")
        }
        if(_id===''){
            return sendError(res,"Invalid User!")
        }
        const user = await userModel.findOne({_id:_id})
        if(!user){
            return sendError(res,"Invalid User!")
        }
         
        if(user.profile.public_id!==''){
            await cloudinary.uploader.destroy(user.profile.public_id)
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path,{folder:'ZevonProfile', gravity:'faces'})

        if(result){
            user.profile.public_id = result.public_id
            user.profile.secure_url = result.secure_url
        }
        await user.save()
        fs.rm(req.file.path)
        sendSuccess(res,"Profile uploaded successfully")
    } catch (error) {
        sendError(res,"Profile uploading Failed!")
    }
}


const addShippingDetails = async(req,res)=>{
    try {
        const {_id,name,houseNo,address,pinCode,city,state,phoneNo}=req.body
        if(name==''|| houseNo=="" || address=='' || pinCode=='' || city=='' || state=='' || phoneNo==''){
            return sendError(res,"All field are required")
        }
        if(_id==''){
            return sendError(res,"Invalid User!")
        }
        const user = await userModel.findOne({_id:_id})
        if(!user){
            return sendError(res,"Invalid User!")
        }
        user.shippingDetails.push({name:name,houseNo:houseNo,address:address,pinCode:pinCode,city:city,state:state,phoneNo:phoneNo})
        await user.save()
        sendSuccess(res,"Shipping Details add successfully")
    } catch (error) {
        sendError(res,"Add shipping details Fialed!")
    }
}
const deleteShippingDetails = async(req,res)=>{
    try {
        const {_id,index}=req.body
        if(index===''){
            return sendError(res,"index no not found!")
        }
        if(_id==''){
            return sendError(res,"Invalid User!")
        }
        const user = await userModel.findOne({_id:_id})
        if(!user){
            return sendError(res,"Invalid User!")
        }
        const shippingDetails = user.shippingDetails.filter((item,i)=>{
            return i!==index
        })
        user.shippingDetails = shippingDetails
        await user.save()
        sendSuccess(res,"Shipping Details delete successfully")
    } catch (error) {
        sendError(res,"delete shipping details Fialed!")
    }
}

const addToCart = async(req,res)=>{
    try {
        const {userId,name,thumbnail,productId,size,qty,color,price,GST,deliveryCharge}=req.body
        if(userId=='' ){
            return sendError(res,"Invalid User")
        }
        if(name=='' || (!thumbnail && !thumbnail.secure_url) || productId==''  || price=='' ){
            return sendError(res,"Invalid Product")
        }
        if(qty==0){
            return sendError(res,"Invalid Quentity!")
        }
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"Invalid User")
        }
        const product = await productModel.findById(productId)
        if(product.stock===0){
            return sendError(res,"Sorry, Product is Out Of Stock!")
        }
        if(product.color.length!==0){
            if(color===''){
                return sendError(res,"Please Select Color")
            }
        }
        if(product.size.length!==0){
            if(size===''){
                return sendError(res,"Please Select Size")
            }
        }
        const alreadyAdded = user.cart.filter((item)=>{
            if(item.productId==productId){
                if(product.size.length!==0 && product.color.length!==0){
                    if(item.size==size && item.color==color){
                        return item
                    }  
                }else if(product.size.length===0 && product.color.length!==0){
                    if( item.color==color){
                        return item
                    }
                }else if(product.size.length!==0 && product.color.length===0){
                    if( item.size==size){
                        return item
                    }
                }
                if(product.size.length===0 && product.color.length===0){
                    return item 
                }
            }
        })
        if(alreadyAdded.length!==0){
            return sendError(res,"Product is already added")
        }
        user.cart.push({name:name,thumbnail:thumbnail.secure_url,productId:productId,size:size,qty:qty,color:color,price:price,GST:GST,deliveryCharge:deliveryCharge})
        await user.save()
        sendSuccess(res,"Product Added successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"something went wrong!")
    }
}

const setQty = async(req,res)=>{
    try {
        const {action,productId,userId,index}=req.body
        if(index===''){
            return sendError(res,"Invalid Index!")
        }
        if(action==''){
            return sendError(res,"Invalid Action!")
        }
        if(productId===''){
            return sendError(res,"Invalid product")
        }
        if(userId==''){
            return sendError(res,"Invalid User")
        }
        const product = await productModel.findById(productId)
        if(!product){
            return sendError(res,"Product not found")
        }
        if(product.stock===0){
            return sendError(res,"Sorry, Product is Out of Stock")
        }
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"Invalid User!")
        }
        const cartItem = user.cart[index]
        if(action=='Inc'){
            if(product.stock<10){
                if(cartItem.qty<product.stock){
                    cartItem.qty = cartItem.qty+1 
                }else{
                    return sendError(res,"Sorry, Unavailable stock!")
                }
            }else{
                if(cartItem.qty<10){
                    cartItem.qty = cartItem.qty+1 
                }else{
                    return sendError(res,"Max Limit is 10")
                }
            }
        }
        if(action == 'Dec'){
            if(cartItem.qty>1){
                cartItem.qty = cartItem.qty-1
            }else{
                return sendError(res,"Product Quentity Can't be 0")
            }
        }
       user.cart[index]=cartItem
        await user.save()
        sendSuccess(res,"Change Quentity successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"Something went wrong!")
    }
}

const removeCartItem = async(req,res)=>{
    try {
        const {userId,index}=req.body
        if(index===''){
            return sendError(res,"Invalid Index")
        }
        if(userId===''){
            return sendError(res,"Invalid User")
        }
        const user =await userModel.findById(userId)
        if(!user){
            return sendError(res,"Invalid User")
        }
        const cartItem = user.cart.filter((item,i)=>{
            if(i!==index){
                return item
            }
        })
        user.cart = cartItem
        await user.save()
        sendSuccess(res,"Remove Item successfully")
    } catch (error) {
        sendError("Something went wrong!")
    }
}

const Logout = async(req,res)=>{
    try{
        res.clearCookie("ZevonToken")
        res.clearCookie("googleZevonToken")
        res.status(202).send({success:"Log Out Successfully"})
    }catch(err){
        res.status(401).send({errors:"Log Out failed"})
    }

}

const contact = (req,res)=>{
    try {
        const {name,email,phone,subject,massage}=req.body
        if(name=='' || email=='' || phone=='' | subject=='' || massage==''){
            return sendError(res,"All Field are required!")
        }
        contactMail(name,email,phone,subject,massage)
        sendSuccess(res,"Massage sent to Admin successfully")
    } catch (error) {
        sendError(res,"Contact Failed!")
    }
}

const changeType = async(req,res)=>{
    const {userId,type} = req.body
    const enumType = ['User','Worker','Admin']
    try {
        if(userId===''){
            return sendError(res,"User Id not Found!")
        }
        if(type===''){
            return sendError(res,"Invalid Type!")
        }
        if(!enumType.includes(type)){
            return sendError(res,"Invalid Type")
        }
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"User Not Found!")
        }
        if(user.type==='Admin'){
            const totalAdmin = await userModel.find({type:'Admin'})
            if(totalAdmin.length<=1){
                return sendError(res,"Please make admin to another")
            }
        }
        user.type = type
        await user.save()
        sendSuccess(res,"Type Changed Successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
const deleteUser = async(req,res)=>{
    const {userId} = req.query
    try {
        if(userId===''){
            return sendError(res,"User Id not Found!")
        }
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"User Not Found!")
        }
        if(user.type==='Admin'){
            const totalAdmin = await userModel.find({type:'Admin'})
            if(totalAdmin.length<=1){
                return sendError(res,"Please make admin to another")
            }
        }
        if(user.profile.public_id!==''){
            await cloudinary.uploader.destroy(user.profile.public_id)
        }
        await userModel.findByIdAndDelete(userId)
        sendSuccess(res,"User delete successfully")
    } catch (error) {
        
        sendError(res,"Something went wrong!")
    }
}

const changeName = async(req,res)=>{
    const {userId,name}=req.body
    if(userId===''){
        return sendError(res,"Invalid User!")
    }
    if(name===''){
        return sendError(res,"Please enter your name")
    }
    try {
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"Invalid User")
        }
        user.name = name
        await user.save()
        sendSuccess(res,"Name update successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
module.exports = { 
    user,
    signUp,
    verifyEmail,
    resentVerificatonCode,
    logIn,
    sendResetLink,
    changePass,
    uploadProfile,
    addShippingDetails,
    deleteShippingDetails,
    addToCart,
    setQty,
    removeCartItem,
    Logout,
    contact,
    allUser,
    changeType,
    deleteUser,
    changeName
}