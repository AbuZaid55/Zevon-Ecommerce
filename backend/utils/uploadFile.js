const multer = require("multer")
const path = require('path')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'Images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})

const limit = {fileSize:50*1024*1024} //50 MB max limit

const fileFilter = (req,file,cb) =>{
    let ext = path.extname(file.originalname)

    if(ext==='.jpg' || ext==='.png' || ext==='.jpeg' || ext==='.webp'){
        cb(null,true)
    }else{
        req.fileError = `File should .jpg, .png, .jpeg, .webp and max size 50MB`
        cb(null,false)
    }
}

const upload = multer({storage:storage,limits:limit,fileFilter:fileFilter}) 

module.exports = upload