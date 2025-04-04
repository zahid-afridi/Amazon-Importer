import axios from 'axios';
import ProductModel from '../models/AmazonProduct.js';
import shopify from '../shopify.js';
import BillingModel from '../models/Billing.js';


const Import = async (req, res) => {
    try {
     
  
        const { url, StoreId,host,key} = req.query;
        const existingProduct = await ProductModel.findOne({ product_url: url, shop_id: StoreId });
        if (existingProduct) {
            return res.status(400).json({ success: false, message: "This product already exists" });
        }
        console.log('this key ',key)
        console.log( 'thsi  is host',host)
       
        // const shopId = req.session.shop; 
        // console.log('this is ShopId',shopId)

        const response = await axios.get(`https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-lookup-product?url=${url}`, {
            headers: {
                'X-RapidAPI-Host': ` axesso-axesso-amazon-data-service-v1.p.rapidapi.com`,
                'X-RapidAPI-Key': `90133ebb8fmsh529d7ad6ac53640p1e9e0cjsna475297080d1`
            }
        });

        const product = response.data;
        const data = {
            title: product.productTitle,
            price: product.price,
            image_url: product.imageUrlList,
            shop_id:StoreId, // Assuming session has an id property
            product_url: url,
            description:product.productDescription,
            store:StoreId,
            productAsin: product.asin
           
           
        };
        console.log('this is product',product)
                await BillingModel.updateOne(
                    {store_id:StoreId},
                     {$inc:{amazonProductNumber:-1}}
                 )
        const saveproduct = await ProductModel.create(data);
               
           res.status(200).json({sucess:true ,message:"Product upload Successfully ",saveproduct,product})
        // res.json({
        //     status: 'success',
        //     data: result
        // });
    } catch (error) {
        // console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Sorry! It\'s taking longer time to get data please try again!'
        });
    }
};





const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const {shopifyId}=req.body
         console.log('product id',id)
        // Find the product in MongoDB by its ID
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log('product deatil',product)

        // Update the inShopify field to true
        product.inShopify = true;
        product.shopifyId=shopifyId

        // Save the updated product
        await product.save();

        // Respond with success message
        res.status(200).json({ success: true, message: 'Product inShopify status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update product inShopify status' });
    }
};


const GetProducts = async (req, res) => {
    try {
        const store = req.params.id;
        
        // Fetch products based on the store ID
        const products = await ProductModel.find({ store: store }); // or { store } for shorthand
        
        if (!products) {
            return res.status(404).json({ message: "No Data are present" });
        }
        
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




export { Import,Update,GetProducts };
