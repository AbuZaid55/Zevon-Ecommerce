const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const JWT  = require("jsonwebtoken")
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    profile:{
        public_id:{
            type:String,
            default:'',
        },
        secure_url:{
            type:String,
            default:'',
        }
    },
    validated:{
        type:Boolean,
        default:false,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['User','Worker','Admin'],
        default:'User',
    },
    shippingDetails:[
        {
            _id:false,
            name:{
                type:String,
                required:true,
                trim:true 
            },
            houseNo:{
                type:String,
                required:true,
                trim:true
            },
            address:{
                type:String,
                required:true,
                trim:true
            },
            pinCode:{
                type:Number,
                required:true,
                trim:true 
            },
            city:{
                type:String,
                required:true,
                trim:true 
            },
            state:{
                type:String,
                required:true,
                trim:true
            },
            phoneNo:{
                type:Number,
                required:true,
                trim:true 
            }
        }
    ],
    cart:[
        {
            _id:false,  
            productId:{
                type:String,
                required:true 
            },
            name:{
                type:String,
                required:true
            },
            thumbnail:{
                type:String,
                required:true
            },
            size:{
                type:String,
            },
            color:{
                type:String,
            },
            price:{
                type:Number,
                required:true
            },
            qty:{
                type:Number,
                require:true
            },
            deliveryCharge:{
                type:Number,
                default:0,
                required:true
            },
            GST:{
                type:Number,
                default:0,
                required:true
            }
        }
    ],
    date:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

userSchema.pre('save',async function(next){
    if(this.isModified("password")){
        const hashPass = await bcrypt.hash(this.password,12)
        this.password = hashPass
    }
    next()
})

userSchema.methods = {
    async comparePass(password){
        return await bcrypt.compare(password,this.password)
    },
    generateToken(){
        return JWT.sign({email:this.email,_id:this._id},process.env.JWT_KEY)
    }
}

module.exports = mongoose.model("user",userSchema)