const router = require('express').Router()
const {createOrder,paymentVerify,getOrders}=require('../controller/orderController')

router.post('/payment/createOrder',createOrder)
router.post('/payment/verify',paymentVerify)
router.post('/getOrders',getOrders)

module.exports=router