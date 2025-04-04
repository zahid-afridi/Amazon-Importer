import express from "express"
import { AffilateCreate } from "../controllers/AffiliateControllers.js"

const AffiliateRoutes=express.Router()

AffiliateRoutes.post('/create',AffilateCreate)

export default AffiliateRoutes