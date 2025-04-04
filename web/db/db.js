import mongoose from "mongoose";

const DbCon=async()=>{
    try {
        
        // await mongoose.connect('mongodb://localhost:27017/AMZCOPY')
        await mongoose.connect('mongodb+srv://shafsamazonaffiliateimporter:shafiali2024@cluster0.zseougt.mongodb.net/AmazonImporterCopy')
        
       
        console.log("Mongo db is conncted")
    } catch (error) {
        console.log(error)
    }
}
export default DbCon