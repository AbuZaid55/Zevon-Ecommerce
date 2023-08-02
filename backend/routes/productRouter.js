const router = require("express").Router()
const upload = require('../utils/uploadFile')
const {
    products,
    addProduct,
    updataProduct, 
    deleteProduct,
    submitReview,
    search,
}=require('../controller/productController')

router.get('/products',products)
router.get('/search/:key',search)
router.post('/add/product',upload.fields([{name:"thumbnail"},{name:"images"}]),addProduct)
router.put('/update/product',upload.fields([{name:"thumbnail"},{name:"images"}]),updataProduct)
router.delete('/delete/product',deleteProduct)
router.post('/review/product',submitReview)

module.exports=router;