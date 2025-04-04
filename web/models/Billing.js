import mongoose from "mongoose";

const BillingShecma= new mongoose.Schema({
    store_id:{
        type:String,
    },
    status:{
        type:String,
    },
    price:{
        type:String,
    },
    billingId:{
        type:String
    },
    packagename:{
        type:String
    },
    amazonProductNumber:{
        type:Number,
        default:0
    },
    CsvProductNumber:{
        type:Number,
        default: 0
    }
},{timestamps:String})

const BillingModel= mongoose.model('store_billings',BillingShecma)


export default BillingModel