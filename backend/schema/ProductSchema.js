const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Enter Product Name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Please Write Product Description']
    },
    price:{
        type:Number,
        required:[true,'Please Enter Product Price'],
        maxLength:[6,"Price can't be more than 6 charecter"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:
    [
        {
            image_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    category:{
         type:String,
         required:[true,'Please Enter Product Category']
    },
    stock:{
        type:Number,
        required:[true,'Please Enter the Product Stock'],
        maxLength:[3,"Stock can't more than 3 charecter"],
        default:1
    },
    numofreviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:'true'
            },
            name:{
            type:String,
            required:true
        }
        ,
            rating:{
            type:Number,
            required:true
            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:'true'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Product',productSchema)