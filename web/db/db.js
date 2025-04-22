import mongoose from "mongoose";


const DbUrl='mongodb+srv://yohan:yohan123@cluster0.rdxmyhl.mongodb.net/AmazonImporter'
// const DbUrl='await mongoose.connect('mongodb://localhost:27017/AMZCOPY')'
const DbCon=async()=>{
    try {
        
        await mongoose.connect(DbUrl)
        
       
        console.log("Mongo db is conncted")
    } catch (error) {
        console.log(error)
    }
}
export default DbCon