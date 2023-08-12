const router = require("express").Router()
const upload = require('../utils/uploadFile')
const {
    products,
    addProduct,
    updataProduct, 
    deleteProduct,
    submitReview,
    deleteReview,
}=require('../controller/productController')
const auth = require("../auth/auth")

router.get('/products',products)
router.post('/add/product',auth,upload.fields([{name:"thumbnail"},{name:"images"}]),addProduct)
router.put('/update/product',auth,upload.fields([{name:"thumbnail"},{name:"images"}]),updataProduct)
router.delete('/delete/product',auth,deleteProduct)
router.post('/review/product',submitReview)
router.post('/reviewDelete/product',auth,deleteReview)

module.exports=router;