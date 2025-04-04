import express from "express";

import { AddProducts, Delete, Update, getPrdouct } from "../controllers/Products.js";

const ProductRoutes =express.Router()

ProductRoutes.get('/getProduct',getPrdouct)
ProductRoutes.post('/addProducts',AddProducts)
ProductRoutes.put('/Update/:id',Update)
ProductRoutes.delete('/delete/:shopifyId',Delete)


export default ProductRoutes