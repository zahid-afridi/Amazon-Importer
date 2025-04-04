
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    image_url: {
        type: [String],  // array of strings
        default: []
    },
    shop_id: { 
        type: String,
        
    },
    product_url: {
        type: String
    },
    description: {
        type: String
    },
    inShopify: {
        type: Boolean,
        default: false
    },
    mainImage:{
        type:String
    },
    shopifyId: {
        type: String,
        default: null
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store"
    },
   

}, { timestamps: true });

const EbayProductsModel= mongoose.model('ebayprdouct', productSchema);

export default EbayProductsModel;
