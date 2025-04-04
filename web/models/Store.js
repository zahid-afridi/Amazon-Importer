import mongoose from "mongoose";

const StoreSchema= new mongoose.Schema({
    storeName:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    country:{
        type:String,
        
    }
},{timestamps:true})

const StoreModel= mongoose.model("Store",StoreSchema)

export default StoreModel