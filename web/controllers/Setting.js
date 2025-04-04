
import SettingModel from "../models/Setting.js"
const GetSetting=async(req,res)=>{
    try {
        const Setting=await SettingModel.find()
        if (!Setting) {
            res.status(404).json({success:false,message:"Not Data Found"})
        }
        res.status(200).json({success:true,Setting})

        
    } catch (error) {
        res.status(500).json({success:false,message:"Intenral server errro"})
        console.log(error)
        
    }
}

export {GetSetting}