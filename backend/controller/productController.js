const {sendError, sendSuccess }= require('../sendResponse')
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const orderModel = require('../models/orderModel')
const fs = require("fs")

const products = async(req,res)=>{
    try {
        const products = await productModel.find()
        res.status(200).json(products)
    } catch (error) {
        sendError(res,"something went wrong!")
    }
}

const addProduct = async(req,res)=>{
    try {
        const {name,description,stock,maxprice,sellprice,deliveryCharge,category,subCategory,color,size,GST}=req.body
        const thumbnail = (req.files && req.files["thumbnail"])?req.files["thumbnail"][0].filename:''
        const img = (req.files && req.files["images"])?req.files["images"]:[]
        const highlight = (req.body.highlight!=='')?JSON.parse(req.body.highlight):[]
        const images = []
        img.map((item)=>{ images.push(item.filename)})
        if(name=='' || description=='' || stock=='' || maxprice=='' || sellprice=='' || category=='' || subCategory=='' ||  thumbnail=='' || images.length==0 ){
            return sendError(res,"All field are required!")
        }
        await productModel({name,description,stock,maxprice,sellprice,deliveryCharge,GST,category,subCategory,color,size,thumbnail,images,highlight}).save()
        sendSuccess(res,"Product Added successfully")
    } catch (error) {
        sendError(res,"something went wrong!")
    }
}

const updataProduct = async(req,res)=>{
    try {
        const thumbnail = (req.files && req.files["thumbnail"])?req.files["thumbnail"][0].filename:''
        const img = (req.files && req.files["images"])?req.files["images"]:[]
        const highlight = (req.body.highlight!=='')?JSON.parse(req.body.highlight):[]
        const images = []
        img.map((item)=>{ images.push(item.filename)})
        const {productId,name,description,stock,maxprice,sellprice,deliveryCharge,category,subCategory,color,size,GST}=req.body
        if(productId==''){
            return sendError(res,"Invalid Porduct Id!")
        }
        if(name=='' || description=='' || stock=='' || maxprice=='' || sellprice=='' || category=='' || subCategory==''){
            return sendError(res,"All field are required!")
        }
        if(thumbnail==='' && images.length==0){
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,deliveryCharge,GST,subCategory,color,size,highlight}}) 
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST}})
        }
        const dbProduct = await productModel.findById(productId)
        if(thumbnail!='' && images.length==0){
            try {
                fs.unlinkSync(`./Images/${dbProduct.thumbnail}`)
            } catch (error) {
                console.log(error)
            }
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,highlight,thumbnail}})
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST,'cart.$.thumbnail':thumbnail}})
            await orderModel.updateMany({'item.productId':productId},{$set:{'item.$.thumbnail':thumbnail}})
        }
        if(thumbnail=='' && images.length!=0){
            try {
                dbProduct.images.map((item)=>{
                    fs.unlinkSync(`./Images/${item}`)
                })
            } catch (error) {
                console.log(error)
            }
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,highlight,images}})
        }
        if(thumbnail!='' && images.length!=0){
            try {
                fs.unlinkSync(`./Images/${dbProduct.thumbnail}`)
            } catch (error) {
                console.log(error)
            }
            try {
                dbProduct.images.map((item)=>{
                    fs.unlinkSync(`./Images/${item}`)
                })
            } catch (error) {
                console.log(error)
            }
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,thumbnail,images}}) 
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST,'cart.$.thumbnail':thumbnail}})
            await orderModel.updateMany({'item.productId':productId},{$set:{'item.$.thumbnail':thumbnail}})
        }
        sendSuccess(res,"Product update successfully")
    } catch (error) {
        sendError(res,"something went wrong!")
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const productId  = req.body.productId 
        if(productId=='' || productId==undefined){
            return sendError(res,"Invalid Product Id!")
        }
        const dbProduct = await productModel.findById(productId)
        try {
            fs.unlinkSync(`./Images/${dbProduct.thumbnail}`)
        } catch (error) {
            console.log(error)
        }
        try {
            dbProduct.images.map((item)=>{
                fs.unlinkSync(`./Images/${item}`)
            })
        } catch (error) {
            console.log(error)
        }
        await productModel.deleteOne({_id:productId})
        sendSuccess(res,"Product delete successfully")
    } catch (error) {
        sendError(res,"something went wrong!")
    }
}

const submitReview = async(req,res)=>{
    try {
        const {userId,username,profile,productId,rating,comment}=req.body
        if(userId=='' || username==''){
            return sendError(res,"Invalid User")
        }
        if(rating==''){
            return sendError(res,"Please give rating")
        }
        if(comment===''){
            return sendError(res,"Please give your opinion")
        }
        const user = await userModel.findById(userId)
        if(!user){
            return sendError(res,"Invalid User")
        }
        const dbData = await productModel.findById(productId)
        const isExist = dbData.reviews.filter((item)=>{
            return item.userId == userId
        })
        if(isExist.length==0){
            dbData.reviews = dbData.reviews.concat({userId:userId,username:username,profile:profile,rating:rating,comment:comment})
            await dbData.save()
            return sendSuccess(res,"Review submit successfully")
        }
        const updatedReview = dbData.reviews.filter((item)=>{
            if(item.userId == userId){
                item.username = username
                item.rating = rating
                item.comment=comment
                item.profile=profile 
            }
            return item
        })
        await productModel.updateOne({_id:productId},{$set:{reviews:updatedReview}})
        sendSuccess(res,"Review update successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"something went wrong!")
    }
}


module.exports = {
    products,
    addProduct,
    updataProduct,
    deleteProduct,
    submitReview, 
}