import shopify from "../shopify.js"
import ProductModel from "../models/AmazonProduct.js"

const getPrdouct = async (req, res) => {
    try {
        
        const Products = await shopify.api.rest.Product.all({
            session: res.locals.shopify.session,
        });

        // Sort products by createdAt date in descending order
        Products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ Products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
};

const AddProducts = async (req, res) => {
    const { title, description, image_url,ProductId,price } = req.body;
    try {
        // Create a new Shopify product object
        const newProduct = await new shopify.api.rest.Product({
            session: res.locals.shopify.session,
            // title: 'hello',
            // body_html: 'hello',
            // images: [{ src: "https://m.media-amazon.com/images/I/41gBvQOnKDL._AC_SL1500_.jpg" }]
        });
         newProduct.title=title,
         newProduct.body_html=description,
         newProduct.images=image_url.map(url =>({src:url}))
         newProduct.variants = [
            {
                "option1": "First",
                "price": price,
                "sku": "123"
          

            }
         ]
           
        
         
              
        newProduct.metafields = [{
       "key": "amazonurl3",
        "value": "Random 2 products",
        "type": "single_line_text_field",
        "namespace": "custom"
        }];


      
        
        await newProduct.save({
            update: true,
        });
        
        console.log("this is new Product Id",newProduct.id)
        console.log("Database product Id",ProductId)
        console.log('product price is comming',price)

            // Send a success response
            res.status(200).json({ message: "Product added successfully", product: newProduct });
       
    } catch (error) {
        // If there's an error, send an error response
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
}
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { shopifyId } = req.body;

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
            shopifyId
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
}
;
const Delete = async (req, res) => {
    try {
        const { shopifyId } = req.params;

        // Delete product from Shopify
        const deletedProduct = await shopify.api.rest.Product.delete({
            session: res.locals.shopify.session,
            id: shopifyId,
        });

        // If product not found in Shopify, return 404
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found in Shopify" });
        }

        // Delete product from MongoDB
        await ProductModel.findOneAndDelete({ shopifyId: shopifyId });

        // Send success response
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
}


export {getPrdouct,AddProducts,Update,Delete}