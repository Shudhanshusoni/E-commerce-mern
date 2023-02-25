const ErrorHandler=require('../utils/errorHandler');

const MiddleError=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || 'Internal Server Error'

//mongodb id error

    if(err.name === 'CastError'){
        const message=`Resource Not Found,Invalid ${err.path}`
        err=new ErrorHandler(message,400);
    }

    if(err.code === 11000){
     const message=`Duplicate ${Object.keys(err.keyValue)} is Entered`
     err=new ErrorHandler(message,400)
    }

    if(err.name === 'JsonWebTokenError'){
        const message='Invalid token,Please try again'
        err=new ErrorHandler(message,400)
    }

    if(err.name === 'TokenExpiredError'){
        const message='Token Expired,Login again'
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        error:err
    })
}
module.exports=MiddleError;