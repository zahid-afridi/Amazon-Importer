import express from 'express'
import { GetPyament, UserPay,StorePyment, FreePakage, custompakage, getcustompakage } from '../controllers/Billing.js'

const BillingRoutes=express.Router()

BillingRoutes.post('/userpay',UserPay)
BillingRoutes.get('/GetPayment',GetPyament)
BillingRoutes.get('/storepyament',StorePyment)
BillingRoutes.post('/freepakage',FreePakage)
BillingRoutes.post('/custompakage',custompakage)
BillingRoutes.get('/getcustompakage',getcustompakage)


export default BillingRoutes