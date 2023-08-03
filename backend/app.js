require("dotenv").config()
const cors = require("cors")
const express = require("express")
const cookie = require("cookie-parser")
const cookieSession = require("cookie-session")
const passport = require("passport")
const app = express()
const port = process.env.PORT
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
    maxAge:24*60*60*100
})) 
app.use(passport.initialize())
app.use(passport.session())
app.use('/Images',express.static('Images'))
app.use('/auth',require('./routes/userRouter'))
app.use(require('./routes/productRouter'))

app.listen(port,()=>{
    console.log(`App listining on port no ${port}`)
})