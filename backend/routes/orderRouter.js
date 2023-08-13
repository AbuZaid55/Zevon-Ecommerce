const router = require('express').Router()
const auth = require('../auth/auth')
const {createOrder,paymentVerify,getOrders,trackOrder, cancleOrder, getAllPayment, deletePayment, getAllFailedPayment, deleteFailedPayment, getAllOrders, changeStatus, deleteOrder}=require('../controller/orderController')

router.post('/payment/createOrder',createOrder)
router.post('/payment/verify',paymentVerify)
router.post('/getOrders',getOrders)
router.post('/trackOrder',trackOrder)
router.post('/cancleOrder',auth,cancleOrder)
router.get('/allPayment',auth,getAllPayment)
router.delete('/deletePayment',auth,deletePayment)
router.get('/allFailedPayment',auth,getAllFailedPayment)
router.delete('/deleteFailedPayment',auth,deleteFailedPayment)
router.get('/allOrders',auth,getAllOrders)
router.post('/changeStatus',auth,changeStatus)
router.post('/deleteOrder',auth,deleteOrder)

module.exports=router