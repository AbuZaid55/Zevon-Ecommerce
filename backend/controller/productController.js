const {sendError, sendSuccess }= require('../sendResponse')
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const orderModel = require('../models/orderModel')
const cloudinary = require('cloudinary')
const fs = require("fs/promises")

const products = async(req,res)=>{
    try {
        const products = await productModel.find()
        sendSuccess(res,"All Products",products)
    } catch (error) {
        sendError(res,"something went wrong!")
    }
}

const addProduct = async(req,res)=>{
    if(req.fileError){
        return sendError(res,req.fileError)
    }
    try {
        const {name,description,stock,maxprice,sellprice,deliveryCharge,category,subCategory,color,size,GST}=req.body
        const thumbnail = (req.files && req.files["thumbnail"])?req.files["thumbnail"][0]:''
        const image = (req.files && req.files["images"])?req.files["images"]:[]
        const highlight = (req.body.highlight!=='')?JSON.parse(req.body.highlight):[]
         if(name=='' || description=='' || stock=='' || maxprice=='' || sellprice=='' || category=='' || subCategory=='' ||  thumbnail=='' || image.length==0 ){
            return sendError(res,"All field are required!")
        }
        let thumb_public_id = ''
        let thumb_secure_url=''
        let image_public_id=[]
        let image_secure_url=[]
        const thumbresult = await cloudinary.v2.uploader.upload(thumbnail.path,{folder:'ZevonThumbnail'})
        if(thumbresult){
            thumb_public_id = thumbresult.public_id
            thumb_secure_url = thumbresult.secure_url
        }
        fs.rm(thumbnail.path)

        for(const file of image){
            const imgresult = await cloudinary.v2.uploader.upload(file.path,{folder:'ZevonImages'})
            if(imgresult){
                image_public_id.push(imgresult.public_id)
                image_secure_url.push(imgresult.secure_url)
            }
            fs.rm(file.path)
        }
        await productModel({name,description,stock,maxprice,sellprice,deliveryCharge,GST,category,subCategory,color,size,'thumbnail.public_id':thumb_public_id,'thumbnail.secure_url':thumb_secure_url,'images.public_id':image_public_id,'images.secure_url':image_secure_url,highlight}).save()
        sendSuccess(res,"Product Added successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"something went wrong!")
    }
}

const updataProduct = async(req,res)=>{
    if(req.fileError){
        return sendError(res,req.fileError)
    }
    try {
        const thumbnail = (req.files && req.files["thumbnail"])?req.files["thumbnail"][0]:''
        const image = (req.files && req.files["images"])?req.files["images"]:[]
        const highlight = (req.body.highlight!=='')?JSON.parse(req.body.highlight):[]
        let thumb_public_id = ''
        let thumb_secure_url=''
        let image_public_id=[]
        let image_secure_url=[]
        const {productId,name,description,stock,maxprice,sellprice,deliveryCharge,category,subCategory,color,size,GST}=req.body
        if(productId==''){
            return sendError(res,"Invalid Porduct Id!")
        }
        if(name=='' || description=='' || stock=='' || maxprice=='' || sellprice=='' || category=='' || subCategory==''){
            return sendError(res,"All field are required!")
        }
        if(thumbnail==='' && image.length===0){
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,deliveryCharge,GST,subCategory,color,size,highlight}}) 
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST}})
        }
        const dbProduct = await productModel.findById(productId)
        if(thumbnail!='' && image.length==0){
            await cloudinary.uploader.destroy(dbProduct.thumbnail.public_id)
            const thumbresult = await cloudinary.v2.uploader.upload(thumbnail.path,{folder:'ZevonThumbnail'})
            if(thumbresult){
                thumb_public_id = thumbresult.public_id
                thumb_secure_url = thumbresult.secure_url
            }
            fs.rm(thumbnail.path)
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,highlight,'thumbnail.public_id':thumb_public_id,'thumbnail.secure_url':thumb_secure_url}})
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST,'cart.$.thumbnail':thumb_secure_url}})
            await orderModel.updateMany({'item.productId':productId},{$set:{'item.$.thumbnail':thumb_secure_url}})
        }
        if(thumbnail=='' && image.length!=0){
            dbProduct.images.public_id.map(async(public_id)=>{
                await cloudinary.uploader.destroy(public_id)
            })
            for(const file of image){
                const imgresult = await cloudinary.v2.uploader.upload(file.path,{folder:'ZevonImages'})
                if(imgresult){
                    image_public_id.push(imgresult.public_id)
                    image_secure_url.push(imgresult.secure_url)
                }
                fs.rm(file.path)
            }
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,highlight,'images.public_id':image_public_id,'images.secure_url':image_secure_url}})
        }
        if(thumbnail!='' && image.length!=0){
            await cloudinary.uploader.destroy(dbProduct.thumbnail.public_id)
            dbProduct.images.public_id.map(async(public_id)=>{
                await cloudinary.uploader.destroy(public_id)
            })
            const thumbresult = await cloudinary.v2.uploader.upload(thumbnail.path,{folder:'ZevonThumbnail'})
            if(thumbresult){
                thumb_public_id = thumbresult.public_id
                thumb_secure_url = thumbresult.secure_url
            }
            fs.rm(thumbnail.path)
    
            for(const file of image){
                const imgresult = await cloudinary.v2.uploader.upload(file.path,{folder:'ZevonImages'})
                if(imgresult){
                    image_public_id.push(imgresult.public_id)
                    image_secure_url.push(imgresult.secure_url)
                }
                fs.rm(file.path)
            }
            await productModel.updateOne({_id:productId},{$set:{name,description,stock,maxprice,sellprice,category,subCategory,deliveryCharge,GST,color,size,'thumbnail.public_id':thumb_public_id,'thumbnail.secure_url':thumb_secure_url,'images.public_id':image_public_id,'images.secure_url':image_secure_url}}) 
            await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.name':name,'cart.$.price':sellprice,'cart.$.deliveryCharge':deliveryCharge,'cart.$.GST':GST,'cart.$.thumbnail':thumb_secure_url}})
            await orderModel.updateMany({'item.productId':productId},{$set:{'item.$.thumbnail':thumb_secure_url}})
        }
        sendSuccess(res,"Product update successfully")
    } catch (error) {
        console.log(error)
        sendError(res,"something went wrong!")
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const productId  = req.query.productId 
        if(productId=='' || productId==undefined){
            return sendError(res,"Invalid Product Id!")
        }
        const dbProduct = await productModel.findById(productId)
        await cloudinary.uploader.destroy(dbProduct.thumbnail.public_id)
        dbProduct.images.public_id.map(async(public_id)=>{
            await cloudinary.uploader.destroy(public_id)
        })
        await productModel.deleteOne({_id:productId})
        await userModel.updateMany({'cart.productId':productId},{$set:{'cart.$.productId':'aa','cart.$.price':'','cart.$.deliveryCharge':'','cart.$.GST':'','cart.$.name':'','cart.$.thumbnail':'','cart.$.qty':0}})
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
            dbData.reviews = dbData.reviews.concat({userId:userId,username:username,profile:profile.secure_url,rating:rating,comment:comment})
            await dbData.save()
            return sendSuccess(res,"Review submit successfully")
        }
        const updatedReview = dbData.reviews.filter((item)=>{
            if(item.userId == userId){
                item.username = username
                item.rating = rating
                item.comment=comment
                item.profile=profile.secure_url 
            }
            return item
        })
        await productModel.updateOne({_id:productId},{$set:{reviews:updatedReview}})
        sendSuccess(res,"Review update successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}

const deleteReview = async(req,res)=>{
    const {productId,userId}=req.body
    if(productId===''){
        return sendError(res,"Product Id not Found!")
    }
    if(userId===''){
        return sendError(res,"User Id not Found!")
    }
    try {
        const product  = await productModel.findById(productId)
        if(!product){
            return sendError(res,"Product not Found!")
        }
        const reviews = product.reviews.filter((review)=>{
            return review.userId!=userId
        })
        product.reviews = reviews
        await product.save()
        sendSuccess(res,"Review Delete Successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }

}


module.exports = {
    products,
    addProduct,
    updataProduct,
    deleteProduct,
    submitReview, 
    deleteReview
}