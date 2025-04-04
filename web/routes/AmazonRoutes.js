import express from "express";
import {  GetProducts, Import, Update } from "../controllers/AmazonImporter.js";
const AmazonRoutes=express.Router()

AmazonRoutes.get('/product/',Import)
AmazonRoutes.put('/product/update/:id',Update)

AmazonRoutes.get('/product/getProducts/:id',GetProducts)


export default AmazonRoutes