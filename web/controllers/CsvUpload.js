import csvtojson from 'csvtojson';
import CsvModel from '../models/CSV.js';
import axios from 'axios';
import pMap from 'p-map';
import ProductModel from '../models/AmazonProduct.js';
import BillingModel from '../models/Billing.js';


const Uplaod = async (req, res) => {
    const { asin } = req.body;
    const { StoreId, key, domain } = req.query;

    try {
        console.log('Store Info:', StoreId, key, domain);
        console.log('ASIN:', asin);

        // Validate ASIN format
        if (!/^[A-Z0-9]{10}$/.test(asin)) {
            return res.status(200).json({ success: false, message: `Invalid ASIN: ${asin}` });
        }

        // Check for available CSV products for the store
        let billing = await BillingModel.findOne({ store_id: StoreId });
        if (!billing || billing.CsvProductNumber <= 0) {
            return res.status(200).json({ success: false, message: "No CSV products available for this store." });
        }

        // Prepare API request parameter
        const ExistsProduct= await ProductModel.findOne({shop_id:StoreId,productAsin:asin})
        if (ExistsProduct) {
            return res.status(200).json({ success: false, message: `This ${asin} is duplicated asin ` });
            
        }
        const params = {
            api_key: 'FFC85BD8F499407E9903F44D307BDA43',
            amazon_domain: domain,
            type: "product",
            asin: asin
        };

        // Make the API request
        const response = await axios.get('https://api.asindataapi.com/request', { params }).catch((err) => {
            console.log('API request failed:', err.message);
            return res.status(200).json({ success: false, message: 'Failed to fetch product data.' });
        });

        if (!response.data || !response.data.product) {
            return res.status(200).json({ success: false, message: `This ${asin} ${response.data.message || 'Product not found'} in the selected country` });
        }

        const productData = response.data.product;

        // Save product data to the database
        const product = {
            title: productData.title,
            price: productData.price,
            image_url: productData.main_image.link,
            product_url: productData.link,
            description: productData.description,
            store: StoreId,
            productAsin: productData.asin,
            shop_id: StoreId
        };

        const savedProduct = await ProductModel.create(product);

        // Update the CSV product count
        await BillingModel.findOneAndUpdate(
            { store_id: StoreId, CsvProductNumber: { $gt: 0 } },
            { $inc: { CsvProductNumber: -1 } },
            { new: true }
        );

        return res.status(200).json({ success: true, message: `Product with ASIN ${asin} fetched and saved successfully`, product: savedProduct });

    } catch (error) {
        console.error('Error:', error);

        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            return res.status(200).json({ success: false, message: `The ASIN ${asin} is invalid` });
        }

        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default Uplaod;
