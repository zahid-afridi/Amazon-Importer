
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './Style.css';
import Routes from "./Routes";

import { useDispatch, useSelector } from "react-redux";
import {
  QueryProvider,
  PolarisProvider,
} from "./components"; // Removed AppBridgeProvider import
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "./hooks";
import { UpdateStoreDetail } from "./redux/UserStoreSlice";
import Spinner from "./components/Spinner";

export default function App() {
  const fetch = useAuthenticatedFetch();
 
  const dispatch = useDispatch();

  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  
  const Products = useSelector((state) => state.StoreInfo);

  const [loading, setLoading] = useState(true);
  
 

  const getParamsFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const paramObj = {};
    for (const [key, value] of params.entries()) {
      paramObj[key] = value;
    }
    return paramObj;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = getParamsFromURL();
        const chargeId = urlParams.charge_id;
             console.log('chargeId',chargeId)
             console.log('Product',Products)
        if (chargeId) {
          const response = await fetch(`/api/billing/GetPayment?ChargeId=${chargeId}&&StoreId=${StoreInfo._id}&&amzProduct=${Products.amzProduct}&&CsvProduct=${Products.csvProduct}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });
           const data= await response.json()
           console.log('Billing',data)
          if (response.status === 200) {
            dispatch(updateAmzProduct(0));
            dispatch(updateCsvProduct(0));
            console.log('api hit sucessfully')
          }
        }

       
          const storeResponse = await fetch('/api/store/info');
        const storeData = await storeResponse.json();
        // console.log('StoreData',storeData)
        dispatch(UpdateStoreDetail(storeData));
      

      
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Added fetch as a dependency

  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();
if (loading) {
  return <Spinner/>
}
  return (
    <PolarisProvider>
 
        <QueryProvider>
          <NavigationMenu
           navigationLinks={[
            { label: 'Import Link', destination: "/ImportLink" },
            { label: 'Upload CSV', destination: "/UploadCSV" },
            
            // { label: 'Amazon Tag', destination: "/AmazonTag" },
            { label: 'Products', destination: "/Products" },
            { label: 'Your Plan', destination: "/Pricing" },
          
          ]}
          />
          <Routes pages={pages} />
        </QueryProvider>
    
    </PolarisProvider>
  );
}
