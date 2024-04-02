import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        index:true
    },
    description:String,
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number,
    owner:{
        type: String,
        default: 'admin'
    } 

})

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection,productSchema);