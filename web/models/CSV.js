import mongoose from "mongoose";
const csvShecma= new mongoose.Schema({
    asin:{
        type:String,
        
    },
  
},{timestamps:true})
const CsvModel= mongoose.model("CSV",csvShecma)
export default CsvModel