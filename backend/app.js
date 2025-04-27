require("dotenv").config()
const cors = require("cors")
const express = require("express")
const cookie = require("cookie-parser")
const cookieSession = require("cookie-session")
const passport = require("passport")
const cloudinary = require('cloudinary')
const app = express()
const port = process.env.PORT
const hostName = process.env.HOSTNAME
const dbConnection = require('./db/db_conn')
require('./utils/passport')

dbConnection()

app.use(cors({
    origin:[process.env.FRONTEND_URL],  
    credentials:true,
}))
app.use(express.json())
app.use(cookie())
app.use(cookieSession({
    name:"googleZevonToken",
    keys:[process.env.JWT_KEY],
    maxAge:Number(process.env.EXPIRE_COOKIE_TIME)
})) 
app.use(passport.initialize())
app.use(passport.session())
app.use('/Images',express.static('Images'))

cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

app.get("/test",(req,res)=>{
    res.status(200).json({message:"Sever is running sucssessfully"})
})


app.use('/auth',require('./routes/userRouter'))
app.use('/order',require('./routes/orderRouter'))
app.use(require('./routes/productRouter'))
app.use('/site',require('./routes/siteSettingRouter'))

app.listen(port,hostName,()=>{
    console.log(`App listining at http://localhost:${port}`)
})