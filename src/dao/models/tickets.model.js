import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code:String,
    purchase_datetime: Date,
    amount:Number,
    purcharser: String,

})

ticketSchema.plugin(mongoosePaginate);

export const ticketModel = mongoose.model(ticketCollection,ticketSchema);