const sendError = (res,massage,status=400)=>{
    res.status(status).json({massage:massage})
}

const sendSuccess = (res,massage,data,status=200)=>{
    if(data){
        res.status(status).json({massage:massage,data:data})
    }else{
        res.status(status).json({massage:massage})
    }
}

module.exports = {
    sendError,
    sendSuccess
}