import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const userCollection = 'sessions'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        index:true
    },
    surname:String,
    mail:String,
    age:Number,
    password:String,


})

userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model(userCollection,userSchema);