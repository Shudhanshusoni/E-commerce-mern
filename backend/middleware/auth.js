const  jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("./catchAsyncError")
const User=require('../schema/userSchema')

exports.isAuthenticateUser=catchAsync( async(req,res,next)=>{
  const {token}=req.cookies;

  if(!token){
    return next(new ErrorHandler('Please Login to access the products',401))
  }

  const decodedData=jwt.verify(token,process.env.JWT_SECRET)

  req.user=await User.findById(decodedData.id);
  next();
  
})

exports.authorizedRole=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(
      new ErrorHandler(`Role: ${req.user.role} is not allowed to use resource`,403)
    )}
    next();
  }
}