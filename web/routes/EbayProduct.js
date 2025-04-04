import express from "express";
// import {  GetProducts, Import, Update } from "../controllers/AmazonImporter.js";
import EbayProductImport from "../controllers/EbayControllers.js";
const EbayProductsRoutes=express.Router()

EbayProductsRoutes.get('/product/',EbayProductImport)
// AmazonRoutes.put('/product/update/:id',Update)

// AmazonRoutes.get('/product/getProducts/:id',GetProducts)


export default EbayProductsRoutes