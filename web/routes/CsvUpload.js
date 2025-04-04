
import express from 'express'
import Uplaod from '../controllers/CsvUpload.js'
import upload from '../multer/CsvFile.js'
const Csvroutes= express.Router()

// Csvroutes.post('/file',upload.single('file'),Uplaod)
Csvroutes.post('/file',Uplaod)

export default Csvroutes