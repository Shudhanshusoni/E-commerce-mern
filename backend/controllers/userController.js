const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../middleware/catchAsyncError');
const User=require('../schema/userSchema');
const sendToken = require('../utils/jwt');
const sendEmail=require('../utils/email');
const crypto=require('crypto');
const cloudinary=require('cloudinary')

exports.registerUser=catchAsync(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const {name, email ,password}=req.body;

    const user=await User.create({
        name,
        email,
        password,
        avatar:{
           image_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });
   sendToken(user,201,res);
});

//login user

exports.loginUser=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please Enter Email & Password',400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid Credential',401))
    }
    const isPasswordMatched=await user.comparePassword(password);
   
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Credential',401))
    }
     
    sendToken(user,200,res);
});

//logout user

exports.logout=catchAsync(async(req,res)=>{
   
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
   
    res.status(200).json({
        success:true,
        message:'successfully LogOut'
    })
})
// forgot password

exports.forgotPassword=catchAsync(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('user not found',404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get('host')}/reset/password/${resetToken}`;
    const message=`Click on the link below to rest your password:- \n\n ${resetPasswordUrl} \n\n if you havent request then please ignore it.`;
    
    try{
        await sendEmail({
            email:user.email,
            subject:'Ecommerce password recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Recovery Email sent to ${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500))
    }
})
//reset password

exports.resetPassword=catchAsync(async(req,res,next)=>{
   const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest('hex');

   const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now()}
   })
   if(!user){
    return next(new ErrorHandler('Invalid or Expired Token',400));
   }
   if(req.body.password!==req.body.confirmPassword){
    return next(new ErrorHandler('confirm password not match',400));
   }
   user.password=req.body.password;
   user.resetPasswordToken=undefined;
   user.resetPasswordExpire=undefined;

   await user.save();
   sendToken(user,200,res)
})
//user detail

exports.getUserDetails=catchAsync( async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})
//update user password

exports.updatePassword=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
   
    if(!isPasswordMatched){
        return next(new ErrorHandler('Incorrect password',400))
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler('confirm password not match',400))
    }
    user.password=req.body.newPassword;
    await user.save();
    
    sendToken(user,200,res)
})
//update user profile

exports.updateProfile=catchAsync(async(req,res,next)=>{
    const updateUserdata = {
        name:req.body.name,
        email:req.body.email,
    }
    console.log("hii");

    if (req.body.avatar !== 'undefined') {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.image_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        updateUserdata.avatar = {
          image_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    const user=await User.findByIdAndUpdate(req.user.id,updateUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});
//get all user

exports.getAllUsers=catchAsync( async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})
//get Single user detail admin

exports.getSingleUserDetail=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user id: ${req.params.id} not exist`,400));
       }
    
    res.status(200).json({
        success:true,
        user
    })
})
//update by admin

exports.updateUserProfile=catchAsync(async(req,res,next)=>{
    const updateUserdata={
        name:req.body.name,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.params.id,updateUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})
//delete user

exports.deleteUser=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user id: ${req.params.id} not exist`,400));
       }

       const imageId = user.avatar.image_id;
       await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
    
    res.status(200).json({
        success:true,
        message:'User Deleted Successfully'
    })
})