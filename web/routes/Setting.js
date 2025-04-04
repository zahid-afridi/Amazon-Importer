import express from 'express'
import { GetSetting } from '../controllers/Setting.js'

const SettingRoutes=express.Router()

SettingRoutes.get('/getSetting',GetSetting)



export default SettingRoutes