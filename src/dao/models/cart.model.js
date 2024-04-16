import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    user_id: String,
    products:{
        type:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                }
            }
        ],
        default:[]
    }

})

export const cartModel = mongoose.model(cartCollection,cartSchema);