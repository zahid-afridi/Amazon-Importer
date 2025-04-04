import mongoose from "mongoose";

const AffilateSchema=new  mongoose.Schema({
    shop_id: {  
        type: String,
        
    },
    CountryCode:{
        type:String,
    },
    Affiliate_id:{
        type:String,
    }
},{
    timestamps:true
})
const AffiliateModel= mongoose.model("Amazon Affiliate",AffilateSchema)

export default AffiliateModel