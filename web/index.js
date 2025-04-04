// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";


import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import Csvroutes from "./routes/CsvUpload.js";
import DbCon from "./db/db.js";

import ProductRoutes from "./routes/Product.js";
import AmazonRoutes from "./routes/AmazonRoutes.js";
import ProductModel from "./models/AmazonProduct.js";
import StoreModel from "./models/Store.js";
import PakagesRoutes from "./routes/Pakages.js";
import BillingRoutes from "./routes/BillingRoutes.js";
import SettingRoutes from "./routes/Setting.js";
import AffiliateRoutes from "./routes/AffiliateRoutes.js";
import AffiliateModel from "./models/Affiliate.js";
import BillingModel from "./models/Billing.js";
import EbayProductsRoutes from "./routes/EbayProduct.js";



const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;


const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/customapi/*", authenticateUser);


async function authenticateUser(req,res,next){
  let shop=req.query.shop
  let storeName= await shopify.config.sessionStorage.findSessionsByShop(shop)
  if (shop === storeName[0].shop) {
    next()
  }else{
    res.send('user not authersiozed')
  }
}
// db connection 
DbCon()
app.use(express.json());
app.use('/api/upload',Csvroutes)
app.use('/api/amazon',AmazonRoutes)
app.use('/api/ebay',EbayProductsRoutes)
app.use('/api/product',ProductRoutes)
app.use('/api/billing',BillingRoutes)

app.use('/api/pakages',PakagesRoutes)
app.use('/api/setting',SettingRoutes)
app.use('/api/affiliate',AffiliateRoutes)
app.get('/api/store/info', async (req, res) => {
  try {
    const Store = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    // console.log("Storename",Store.data[0].domain)
      // console.log('Store Information',Store)
    if (Store && Store.data && Store.data.length > 0) {
      const storeName = Store.data[0].name;
      const domain = Store.data[0].domain;
      const country=Store.data[0].country;
     

    
      let existingStore = await StoreModel.findOne({ storeName });

if (!existingStore) {
  const newStore = new StoreModel({ storeName, domain, country });
  const saveStore = await newStore.save();

  if (saveStore && saveStore._id) {
    await BillingModel.create({
      store_id: saveStore._id,
      amazonProductNumber: 10,
      CsvProductNumber:10
    });
    console.log('Billing entry created successfully');
  }

  existingStore = saveStore;  // This is where the issue occurs
}


      // Send response with existingStore only
      res.status(200).json(existingStore); // Send existingStore directly in the response
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

//   try {
//       const shopifyId = req.params.id; // Capture shopifyId from URL
//       const product = await ProductModel.findOne({ shopifyId }); // Use findOne instead of find for a single document

//       if (!product) {
//           return res.status(404).json({ message: 'Product not found' });
//       }

//       console.log("product detail", product);
//       const productUrl = product.product_url;
//       const ProductAsin = product.productAsin;
//       console.log('productUrl', productUrl);
//       console.log('ProductAsin', ProductAsin);

//       const affiliates = await AffiliateModel.find({ shop_id: product.shop_id });
//       let responseSent = false;

//       affiliates.forEach((item) => {
//           if (responseSent) return; // Skip if response is already sent

//           if (productUrl.includes(item.CountryCode.split('.').slice(-2).join('.'))) {
//               res.status(200).json({ ProductLink: `http://www.${item.CountryCode}/dp/${ProductAsin}?tag=${item.Affiliate_id}` }); // Send the product directly
//               console.log('countryCode', item.CountryCode);
//               responseSent = true;
//           }
//       });

//       if (!responseSent) {
//           res.status(200).json({ ProductLink: productUrl }); // Send the product directly if no affiliate link was sent
//       }

//       console.log('Amazon Affiliates', affiliates);

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



// them id get api 

app.use('/customapi/getProduct/:id', async (req, res) => {
  try {
      const shopifyId = req.params.id; // Capture shopifyId from URL
      const product = await ProductModel.findOne({ shopifyId }); // Use findOne instead of find for a single document

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      console.log("product detail", product);
      const productUrl = product.product_url;
      const ProductAsin = product.productAsin;
      console.log('productUrl', productUrl);
      console.log('ProductAsin', ProductAsin);

      const affiliates = await AffiliateModel.find({ shop_id: product.shop_id });
      let responseSent = false;

      affiliates.forEach((item) => {
          if (responseSent) return; // Skip if response is already sent

          const countryCodeRegex = new RegExp(`^https?://www\\.${item.CountryCode}/`);
          if (countryCodeRegex.test(productUrl)) {
              res.status(200).json({ ProductLink: `http://www.${item.CountryCode}/dp/${ProductAsin}?tag=${item.Affiliate_id}` }); // Send the product directly
              console.log('countryCode', item.CountryCode);
              responseSent = true;
          }
      });

      if (!responseSent) {
          res.status(200).json({ ProductLink: productUrl }); // Send the product directly if no affiliate link was sent
      }

      console.log('Amazon Affiliates', affiliates);

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.use('/api/theme/info', async (req, res) => {
  try {
    const Store = await shopify.api.rest.Theme.all({
      session: res.locals.shopify.session,
    });
    const mainTheme = Store.data.find(theme => theme.role === 'main');
    console.log(mainTheme)
    if (!mainTheme) {
      return res.status(404).json({ message: 'Main theme not found' });
    }
    
    res.status(200).json({ mainTheme });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});
// settting them assest 
app.get('/api/assest/info', async (req, res) => {
  try {
    const themdId= req.query.themdId;
    console.log("themId here",themdId)
    const Assest = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      asset: {"key": "config/settings_data.json"},
      theme_id:themdId
    });

    
    res.status(200).json({ Assest });
   
  } catch (error) {
    console.error('assesst api error',error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

app.put("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.on('error',(error)=>{
  console.log('error',error)
})

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
