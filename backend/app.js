require("dotenv").config()
const cors = require("cors")
const express = require("express")
const cookie = require("cookie-parser")
const app = express()
const port = process.env.PORT
const dbConnection = require('./db/db_conn')
 
dbConnection()

app.use(cors({
    origin:[process.env.FRONTEND_URL],  
    credentials:true,
}))
app.use(express.json())
app.use(cookie())
app.use('/Images',express.static('Images'))
app.use('/auth',require('./routes/userRouter'))
app.use(require('./routes/productRouter'))

app.listen(port,()=>{
    console.log(`App listining on port no ${port}`)
})