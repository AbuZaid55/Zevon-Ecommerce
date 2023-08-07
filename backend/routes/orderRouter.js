const router = require('express').Router()
const {createOrder,paymentVerify,getOrders,trackOrder, cancleOrder}=require('../controller/orderController')

router.post('/payment/createOrder',createOrder)
router.post('/payment/verify',paymentVerify)
router.post('/getOrders',getOrders)
router.post('/trackOrder',trackOrder)
router.post('/cancleOrder',cancleOrder)

module.exports=router