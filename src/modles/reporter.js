const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true, 
        unique:true,
    validate(value){
    if(!validator.isEmail(value)){
        throw new Error ('Email is invalid')
        }
    }     
    },
    age:{
        type:Number,
        default:20,
        validate(value){
        if(value<=0){
            throw new Error('Age must be a postive number')
        }
    }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error('Password must include uppercase,lowercase,numbers,speical character')
            }
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
})
////////////////////////////////////////
// login 
reporterSchema.statics.findByCredentials = async (em,password) =>{
    const reporter = await Reporter.findOne({email:em})
    if(!reporter){
        throw new Error('Unable to login')
    }
    const isMatch = await bcryptjs.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return reporter
}


/////////////////////////////////////////////////////////////
reporterSchema.pre('save',async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)
})
////////////////////////////////////////////////////
reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},JWT_SECRET)
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}



const Reporter = mongoose.model('Reporter',reporterSchema)
module.exports = Reporter
