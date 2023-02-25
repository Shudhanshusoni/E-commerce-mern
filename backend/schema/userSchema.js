const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            requires:[true,'Enter Your Name'],
            minlength:[4,'Please Type Your FullName']
        },  
        email:{
            type:String,
            required:[true,'Enter Your Email'],
            validate:[validator.isEmail,'Please Enter a Valid Email'],
            unique:true
        },
        password:{
            type:String,
            required:[true,'Enter Your Password'],
            minlength:[6,'Paasword cannot be less than 6 character'],
            select:false,
        },
        avatar:{       
                image_id:{
                    type:String,
                    required:true,
                },
                url:{
                    type:String,
                    required:true
                },
        },
        role:{
            type:String,
            default:'user'
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
});
// password hashing
userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
});
//jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:'2d',
    })
}
//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
     return await bcrypt.compare(enteredPassword,this.password)
}
//reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken=crypto.randomBytes(10).toString("hex");

  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
  this.resetPasswordExpire=Date.now() + 15*60*1000;

  return resetToken;
}

module.exports=mongoose.model('User',userSchema);