import multer from "multer";
import path from 'path';

const storage=multer.diskStorage({
   
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload=multer ({
    storage:storage
})

export default upload