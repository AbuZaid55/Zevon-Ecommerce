const router = require("express").Router()
const auth = require('../auth/auth.js')
const multer = require('../utils/uploadFile.js')
const passport = require("passport")
const {user,signUp, verifyEmail,resentVerificatonCode, logIn,sendResetLink, changePass, uploadProfile,addShippingDetails,deleteShippingDetails, addToCart, setQty, removeCartItem,Logout, contact}=require('../controller/userController')

router.get('/user',auth,user)
router.post('/signup',signUp)
router.post('/verifyEmail',verifyEmail)
router.post('/resentVerificatonCode',resentVerificatonCode)
router.post('/login',logIn)
router.post('/sendResetLink',sendResetLink)
router.post('/changePass',changePass)
router.post('/uploadProfile',multer.single("profile"),uploadProfile)
router.post('/addShippingDetails',addShippingDetails)
router.post('/deleteShippingDetails',deleteShippingDetails)
router.post('/addToCart',addToCart)
router.post('/setQty',setQty)
router.post('/removeCartItem',removeCartItem)
router.post('/contact',contact)
router.get('/logout',Logout)
router.get("/google",passport.authenticate("google", { scope: ["profile","email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),(req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}?googleLogin=true`);
});

module.exports=router;