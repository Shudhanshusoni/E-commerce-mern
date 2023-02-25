const catchAsync = require('../middleware/catchAsyncError');
const Product=require('../schema/ProductSchema');
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures=require('../utils/apifeatures')
const cloudinary = require("cloudinary");

exports.createProducts=catchAsync(async(req,res,next)=>{
    let images = [];
    
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      image_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

    const product=await Product.create(req.body);
    res.status(201).json({
     success:true,
     product
    });
});

exports.getallProducts=catchAsync(async (req,res,next)=>{

    const resultPerPage=8;
    const productsCount=await Product.countDocuments();

    const apiFeatures=new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
        // let products = await apiFeatures.query;

        // let filteredProductsCount = products.length;
      
        // apiFeatures.pagination(resultPerPage);

const products=await apiFeatures.query;
res.status(200).json({
    success:true,
    products,
    productsCount,
    resultPerPage,
    // filteredProductsCount
  });
});

exports.getProductDetail=catchAsync(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorHandler('Product Not Found', 404))
    }
    res.status(200).json({
        success:true,
        product
    })
})

exports.updateProduct=catchAsync(async(req,res)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
       return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    let images = [];
    
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].image_id);
        }
    
        const imagesLinks = [];
    
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
    
          imagesLinks.push({
            image_id: result.public_id,
            url: result.secure_url,
          });
        }
    
        req.body.images = imagesLinks;
      }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})

exports.deleteProduct=catchAsync(async(req,res)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found', 404))
    }
   // deleting images in cloudinary
   for(let i=0;i<product.images.length;i++){
    await cloudinary.v2.uploader.destroy(product.images[i].image_id)
   }
    await product.remove();
    res.status(200).json({
        success:true,
        message:'Product Deleted Successfully'
    })
});
// product review

exports.createProductReview=catchAsync(async(req,res)=>{
    const { rating, comment, productId } = req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Product.findById(productId);
    const isReviwed = product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());
    if(isReviwed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating;
                rev.comment=comment;
              }
        }); 
    }
    else{
        product.reviews.push(review);
        product.numofreviews=product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating;
    })
    product.ratings=avg/product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        product
    })
})
// get all review of product

exports.getSingleProductReview=catchAsync(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
       return next(new ErrorHandler('Product Not Found', 404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})
//delete review

exports.deleteSingleProductReview=catchAsync(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
       return next(new ErrorHandler('Product Not Found', 404))
    }

    const reviews = product.reviews.filter((rev)=>
        rev._id.toString() !== req.query.id.toString()
    )

    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    })
    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numofreviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numofreviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });


    res.status(200).json({
        success:true,
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });
  