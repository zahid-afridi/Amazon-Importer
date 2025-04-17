


import BillingModel from "../models/Billing.js"
import CustomPlaneModel from "../models/Customplan.js"
import shopify from "../shopify.js"


const UserPay=async(req,res)=>{

    try {  
        const {  StoreId} = req.query
       
       
        const {name,price,retrun_url,amazonProductNumber,CsvProductNumber}=req.body
        
        const appliction_charge = await new shopify.api.rest.ApplicationCharge({
            session: res.locals.shopify.session,
        })
        // const appliction_charge = await new shopify.api.rest.RecurringApplicationCharge({
        //     session: res.locals.shopify.session,
        // })
      
        appliction_charge.name =name,
        appliction_charge.price= price,
        appliction_charge.return_url =retrun_url
        appliction_charge.test =false;
       
        await appliction_charge.save({
            update:true
        })
      
       console.log('AplicationCharge',appliction_charge)
       
     
        res.status(200).json(appliction_charge)
    } catch (error) {
        res.status(500).json({message:'intnernal server errror'})
        console.log('getPyament error',error)
        
    }
}

const GetPyament=async(req,res)=>{
    try {
        const {ChargeId,StoreId,amzProduct,CsvProduct}=req.query;
        console.log('ChageId ',ChargeId)

        console.log("AmazonProucnumber",amzProduct,CsvProduct)
        const appliction_charge = await shopify.api.rest.ApplicationCharge.find({
            session: res.locals.shopify.session,
            id:ChargeId
        })
        const FindStoreBilling=await BillingModel.findOne({store_id:StoreId})
        const updateFields = {
            $set: {
                packagename: appliction_charge.name,
                status: appliction_charge.status,
                billingId: appliction_charge.id,
                price: appliction_charge.price
            }
        };
        if (amzProduct !== 'null') {
            updateFields.$inc = updateFields.$inc || {};
            updateFields.$inc.amazonProductNumber = amzProduct;
        }

        if (CsvProduct !== 'null') {
            updateFields.$inc = updateFields.$inc || {};
            updateFields.$inc.CsvProductNumber = CsvProduct;
        }
        if (FindStoreBilling) {
            await BillingModel.updateOne(
                { store_id: StoreId },
                updateFields
              
            );
        } else{
            await BillingModel.create({
                store_id: StoreId,
                packagename:appliction_charge.name,
                status: appliction_charge.status,
                billingId: appliction_charge.id,
                price: appliction_charge.price,
                amazonProductNumber: amzProduct,
                CsvProductNumber: CsvProduct
            });
        }
      
        res.status(200).json(appliction_charge)
    } catch (error) {
        res.status(500).json({message:'intnernal server errror'})
        console.log(error)
    }
}

const StorePyment=async(req,res)=>{
    try {
        const {  StoreId} = req.query
        const StorePayment= await BillingModel.findOne({store_id:StoreId})
        if (!StorePayment) {
            return res.status(404).json({success:false,message:"Not data Found"})
        }
        return res.status(200).json({success:true,StorePayment})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
        
    }
  
}
const FreePakage=async(req,res)=>{
    try {
        const {  StoreId} = req.query

     
       
            const {name,price,amazonProductNumber,CsvProductNumber}=req.body
            console.log("AmazonProucnumber",amazonProductNumber,CsvProductNumber)
      const checkpagae=await BillingModel.findOne({store_id:StoreId})
      if (checkpagae) {
        return res.status(404).json({success:false,message:"You Already Use Free Package"})
      }
      const CreatFreePkage= new BillingModel({
        name,status:"active",price,amazonProductNumber,CsvProductNumber,store_id:StoreId
      })
      await CreatFreePkage.save()
      res.status(200).json({message:"Package Create Successfully",CreatFreePkage})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
        
    }
}

const custompakage=async(req,res)=>{
    try {
        const {  StoreId } = req.query
        const {amazonProduct,csvProduct,email,message}=req.body
        
        const customplane=await CustomPlaneModel({
            amazonProduct,csvProduct,email,message,store_id:StoreId
        })
    await customplane.save()
        res.status(200).json({message:'Package Created Successfully',customplane})
    } catch (error) {
        console.log(error)
    }
}
const getcustompakage=async(req,res)=>{
    try {
        const {  StoreId } = req.query
        const Custompakage=await CustomPlaneModel.find({store_id:StoreId})
        if (!Custompakage) {
            res.status(404).json({message:'Not data found'})
        }
        console.log('this is cusotm pakage',Custompakage)
        res.status(404).json({Custompakage})
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export {UserPay,GetPyament,StorePyment,FreePakage,custompakage,getcustompakage}