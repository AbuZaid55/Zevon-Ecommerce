const {sendError,sendSuccess}=require('../sendResponse')
const Razorpay = require("razorpay")
const crypto  = require("crypto")
const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const failedPaymentModel = require('../models/PaymentFailed')
const paymentModel = require('../models/Payment')

let userEmail = ''
let shippingDetails = ''
let phoneNo=''
let totalPrice = 0  
let GST = 0
let deliveryCharge = 0
const createOrder = async(req,res)=>{
    //get user details
    const {email,address}=req.body
    if(!email){
        return sendError(res,"Invalid User")
    }else{
        userEmail=email
    }
    if(!address){
        return sendError(res,"Please Select address")
    }else{
        shippingDetails=address
        phoneNo=address.phoneNo
    }
    const user = await userModel.findOne({email:userEmail})
    if(!user){
        return sendError(res,"Invalid User")
    }
    const cart = user.cart
    if(cart.legnth===0){
        return sendError(res,"Your card is empty")
    }

    cart.map((item)=>{
        totalPrice = totalPrice+(item.price*item.qty)
        GST = GST+(item.GST*item.qty)
        deliveryCharge=deliveryCharge+(item.deliveryCharge*item.qty)
    })

    //carate razorpay instance
    try {
        const instance = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET 
        })
        const options = {
            amount:Number(totalPrice+GST+deliveryCharge)*100,
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        }
        instance.orders.create(options,(error,order)=>{
            if(error){
                return sendError(res,"Something Went Wrong!")
            }
            order["razorpay_key_id"]=process.env.RAZORPAY_KEY_ID
            sendSuccess(res,"CreateOrder seccessfull",order)
        })
    } catch (error) {
        sendError(res,"Something Went Wrong!")
    }
}

const paymentFailed = async(razorpay_payment_id,razorpay_order_id)=>{
    try {
        const user = await userModel.findOne({email:userEmail})
        await failedPaymentModel({username:user.name,email:user.email,userId:user._id,phoneNo:phoneNo,totalFailedAmount:totalPrice+GST+deliveryCharge,razorpay_payment_id:razorpay_payment_id,razorpay_order_id,razorpay_order_id}).save()
    } catch (error) {
        console.log(error)
    }
}
const successPayment = async(razorpay_payment_id,razorpay_order_id)=>{
    try {
        const user = await userModel.findOne({email:userEmail})
        await paymentModel({username:user.name,email:user.email,userId:user._id,phoneNo:phoneNo,totalPaidAmount:totalPrice+GST+deliveryCharge,razorpay_payment_id:razorpay_payment_id,razorpay_order_id,razorpay_order_id}).save()
    } catch (error) {
        console.log(error)
    }
}

const paymentVerify = async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body 
    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSign = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex")
        if(razorpay_signature===expectedSign){
            const user = await userModel.findOne({email:userEmail})
            if(!user){
                paymentFailed(razorpay_payment_id,razorpay_order_id)
                return sendError(res,"Payment Failed!")
            }
            if(shippingDetails===''){
                paymentFailed(razorpay_payment_id,razorpay_order_id)
                return sendError(res,"Payment Failed!")
            }
            user.cart.map(async(item)=>{
                const product = await productModel.findById(item.productId)
                if(product.stock<=item.qty){
                    product.stock=0
                }else{
                    product.stock=product.stock-item.qty
                }
                await product.save()
            })
            await orderModel({username:shippingDetails.name,userId:user._id,email:user.email,phoneNo:phoneNo,totalPaidAmount:totalPrice+GST+deliveryCharge,shippingDetails:shippingDetails,item:user.cart,razorpay_payment_id:razorpay_payment_id,razorpay_order_id:razorpay_order_id}).save()

            user.cart=[]
            await user.save()
            successPayment(razorpay_payment_id,razorpay_order_id)
            sendSuccess(res,"Your Order has been Placed successfully")
        }else{
            paymentFailed(razorpay_payment_id,razorpay_order_id)
            sendError(res,"Payment Failed")
        }
    } catch (error) {
        paymentFailed(razorpay_payment_id,razorpay_order_id)
        sendError(res,"Payment Failed!")
    }
}

const getOrders = async(req,res)=>{
    try {
        const {_id}=req.body 
        if(!_id){
            return sendError(res,"Invalid User")
        }
        const orders = await orderModel.find({userId:_id})
        if(!orders){
            return sendError(res,"No Orders")
        }
        sendSuccess(res,"Your orders",orders)
    } catch (error) {
        sendError(res,error)
    }
}

const trackOrder = async(req,res)=>{
    const {orderId}=req.body
    if(!orderId || orderId===''){
        return sendError(res,"Order id not found!")
    }
    try {
        const order = await orderModel.findById(orderId)
        if(!order){
            return sendError(res,"Order not found!")
        }
        sendSuccess(res,"Order Status",order.status)
    } catch (error) {
        sendError(res,"Order not found!")
    }
}

const cancleOrder = async(req,res)=>{
    const {orderId,userId}=req.body
    if(orderId===''){
        return sendError(res,"Something Went Wrong!")
    }
    if(userId===''){
        return sendError(res,"Invalid User!")
    }
    try {
        const order = await orderModel.findById(orderId)
        if(!order){
            return sendError(res,"Order not found")
        }
        if(!order.userId===userId){
            return sendError(res,"Invalid User!")
        }
        order.status = "Cancelled"
        await order.save()
        sendSuccess(res,"Your Order is successfully canceled")
    } catch (error) {
        sendError(res,"Something Went Wrong!")
    }
}

const getAllPayment = async(req,res)=>{
    try {
        const payment = await paymentModel.find()
        sendSuccess(res,"All Payment Details",payment)
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
const deletePayment = async(req,res)=>{
    const {_id} = req.query
    try {
        if(_id===''){
            return sendError(res,"Id not Found!")
        }
        await paymentModel.findByIdAndDelete(_id)
        sendSuccess(res,"User delete successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}

const getAllFailedPayment = async(req,res)=>{
    try {
        const payment = await failedPaymentModel.find()
        sendSuccess(res,"All Payment Details",payment)
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
const deleteFailedPayment = async(req,res)=>{
    const {_id} = req.query
    try {
        if(_id===''){
            return sendError(res,"Id not Found!")
        }
        await failedPaymentModel.findByIdAndDelete(_id)
        sendSuccess(res,"User delete successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}

const getAllOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find()
        if(!orders){
            return sendError(res,"No Orders")
        }
        sendSuccess(res,"All orders",orders)
    } catch (error) {
        sendError(res,error)
    }
}

const changeStatus = async(req,res)=>{
    const {orderId,status}=req.body
    const statusType = ["Processing","Confirmed","Shipped","Out For Delivery","Delivered","Cancelled","Refund"]
    if(orderId===''){
        return sendError(res,"Order Id not Found!")
    }
    if(status==='' || !statusType.includes(status)){
        return sendError(res,"Invalid Status Type!")
    }
    try {
        const order = await orderModel.findById(orderId)
        if(!order){
            return sendError(res,"Order Not Found!")
        }
        order.status=status
        await order.save()
        sendSuccess(res,"Status Changed Successfully")
    } catch (error) {
        sendError(res,"Something went wrong!")
    }
}
module.exports = {
    createOrder,
    paymentVerify,
    getOrders,
    trackOrder,
    cancleOrder,
    getAllPayment,
    deletePayment,
    getAllFailedPayment,
    deleteFailedPayment,
    getAllOrders,
    changeStatus,
}