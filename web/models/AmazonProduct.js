
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
    shopifyId: {
        type: String,
        default: null
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store"
    },
    productAsin: {
        type: String
    }

}, { timestamps: true });

const ProductModel = mongoose.model('AmazonProduct', productSchema);

export default ProductModel;
