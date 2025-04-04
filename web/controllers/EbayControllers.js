
import axios from "axios"

import EbayProductsModel from "../models/EbayProducts.js";

const EbayProductImport=async(req,res)=>{
    try {
        const {url,StoreId}= req.query;
        console.log('url',url)
        const response= await  axios.get(`https://real-time-ebay-data.p.rapidapi.com/product_get.php?url=${url}`,{
            headers:{
                'x-rapidapi-key': '9e6f0292edmsh18de09964866e71p170c7bjsn0e9f68d91a81',
		'x-rapidapi-host': 'real-time-ebay-data.p.rapidapi.com'
           }
        });
        const product= response.data;
        console.log('prdouct title',product )
        // console.log('prdouct title',product.body?.title )
        // console.log('prdouct title',product.body?.price.value )
        // console.log('prdouct title',product.body?.images )
        // console.log('prdouct title',product.body?.description )
            const newProduct = new EbayProductsModel({
            title: product.body?.title ,
            price: product.body?.price.value , // Combine price and currency
            image_url: product.body?.images , // Array of image URLs
            shop_id: StoreId,
            product_url: product.body?.url ,
            description: product.body?.description , // Fallback if description is empty
            inShopify: false, // Default value
            shopifyId: null, // Default value
            store: null, // Adjust if needed
            mainImage:product.body?.mainImage
        });

        // Save the new product in the database
        await newProduct.save();
        // res.status(200).json({
        //     success: true,
        //     message: "Product fetched successfully",
        //     product: newProduct,
        //     mainImage: product.body?.mainImage // Send the main image in the response
        //   });

            res.status(200).json({
                success: true,
                message: "Product fetched successfully",
                product: {
                    title: product.body?.title ,
                    price: product.body?.price.value , // Combine price and currency
                    image_url: product.body?.images , // Array of image URLs
                    shop_id: StoreId,
                    product_url: product.body?.url ,
                    description: product.body?.description , // Fallback if description is empty
                    inShopify: false, // Default value
                    shopifyId: null, // Default value
            mainImage: product.body?.mainImage ,// Send the main image in the response

                    store: null, // Adjust if needed
                }
              }
              );
        

    } catch (error) {
        console.log('Ebay Product error',error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
    }


export default EbayProductImport