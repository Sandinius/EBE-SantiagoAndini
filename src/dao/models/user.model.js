import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const userCollection = 'sessions'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        index:true
    },
    surname:String,
    mail:{
        type: String,
        unique: true
    },
    age:Number,
    password:String,
    cart: Number,
    role:{
        type: String,
        default: 'user'
    }, 
    documents:{
        type:[
            {
                name: String,
                reference: String
            }
        ],
        default:[]
    },
    last_connection: String
})

userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model(userCollection,userSchema);