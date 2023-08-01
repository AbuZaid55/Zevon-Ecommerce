const nodemailer = require("nodemailer")
const {otpMailTemplate, greetingMailTemplate,linkSendMailTemplate} = require("./mailTemplate")
var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure:false,
    requireTLS:true,
    auth: {
        user: process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
})

const otpMail = (to,otp)=>{
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject:"Verify your email account",
        html: otpMailTemplate(otp)
    },(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Mail successfull sent")
        }
    })
}
const greetingMail = (to,massage)=>{
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject:"Congratulations! Your account has been verified",
        html: greetingMailTemplate(massage)
    },(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Mail successfull sent")
        }
    })
}
const linkSendMail = (to,link)=>{
    transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject:"Change your password",
        html: linkSendMailTemplate(link)
    },(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Mail successfull sent")
        }
    })
}

module.exports = {
    otpMail,
    greetingMail,
    linkSendMail,
};