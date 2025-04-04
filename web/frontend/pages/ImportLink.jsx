
import React, { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import ProductModal from '../components/ProductModal';
import toast from 'react-hot-toast';
import LoadingBtn from '../components/LoadingBtn';
import { useSelector } from 'react-redux';
import AlretBar from '../components/AlretBar';
import UpgradeAlret from '../components/UpgradeAlret';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function ImportLink() {
  const navigate = useNavigate();
  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  
  const fetch = useAuthenticatedFetch();
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [shopifyId, setShopifyId] = useState('');
  const [storepyament, setStorepyament] = useState('');
  const [refreshState, setRefreshState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rapidhost, setRapidhost] = useState('');
  const [rapidkey, setRapidkey] = useState('');
  console.log('this is rapid api key', rapidkey);
  console.log('this is key api host', rapidhost);


  useEffect(() => {
    const getSettings = async () => {
      try {
        const request = await fetch(`/api/setting/getSetting`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Add this header to specify JSON content
          },
        });
        const response = await request.json();
        if (response.success && response.Setting) {
          response.Setting.forEach((setting) => {
            if (setting.keyName === 'rapidapi_host') {
              setRapidhost(setting.keyValue);
            } else if (setting.keyName === 'rapidapi_key') {
              setRapidkey(setting.keyValue);
            }
          });
        }
        console.log('GetSetting', response);
      } catch (error) {
        console.log(error);
      }
    };

    const getStorePayment = async () => {
      try {
        const request = await fetch(`/api/billing/storepyament?StoreId=${StoreInfo._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Add this header to specify JSON content
          },
        });
        const response = await request.json();
        setStorepyament(response.StorePayment);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      setSpinner(true);
      await Promise.all([getSettings(), getStorePayment()]);
      setSpinner(false);
    };

    fetchData();
  }, [refreshState, StoreInfo._id]);

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/amazon/product/?url=${link}&&StoreId=${StoreInfo._id}&&host=${rapidhost}&&key=${rapidkey}`, {
        method: 'GET',
      });
      // if (!response.ok) {
      //   throw new Error('Failed to fetch product data');
      // }
      const data = await response.json();
      if (data) {
        toast.success(data.message)
      }
     
      console.log('Amazon data', data);
      setProduct(data.saveproduct); // Accessing product details from 'saveproduct' field
      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to import product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLink('');
    setProduct(null);
    setRefreshState(!refreshState);
  };

  const handleUploade = async () => {
    try {
      setLoading(true);
      const request = await fetch('/api/product/addProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Add this header to specify JSON content
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          image_url: product.image_url,
          ProductId: product._id,
          price: product.price,
        }),
      });
      const response = await request.json();
      const shopifyId = response.product.id;
      setShopifyId(shopifyId);
      console.log(response);
      setLoading(false);
      setRefreshState(!refreshState);
      if (request.ok) {
        await fetch(`/api/amazon/product/update/${product._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Add this header to specify JSON content
          },
          body: JSON.stringify({
            shopifyId: shopifyId,
          }),
        });
        toast.success(response.message);
        setShowModal(false);
        setLink('');
      } else {
        toast.error('Failed to upload product to Shopify.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload product to Shopify. Please try again.');
    }
  };

  const handleUpdate = () => {
    navigate('/Pricing');
  };

  if (typeof storepyament === 'undefined') {
    
    // navigate('/Pricing');
   return  <UpgradeAlret handleUpdate={handleUpdate} title={'Please purchase a plan to continue using the app.'}/>


  }
  if (storepyament && storepyament.amazonProductNumber == 0) {
    return (
      <>
        <UpgradeAlret title={'You have reached the limit of product imports. Please upgrade your plan to continue'} handleUpdate={handleUpdate} />
      </>
    );
  }

  if (spinner) {
    return <Spinner />;
  }

  return (
    <>
            {storepyament && <AlretBar title={`You have ${storepyament.amazonProductNumber} Products Remaining`} />}

     
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Import Product from Amazon</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="amazonLink" className="form-label">
                      Amazon Product Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="amazonLink"
                      placeholder="Enter Amazon product link"
                      value={link}
                      onChange={handleLinkChange}
                    />
                  </div>
                  {loading ? (
                    <LoadingBtn />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={handleImport}
                      disabled={!link || loading}
                    >
                      Import
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {showModal && product && (
          <ProductModal
            title={product.title}
            description={product.description}
            imageUrl={product.image_url}
            price={product.price}
            BtnText="Add to Shopify"
            handleCloseModal={handleCloseModal}
            HandleClick={handleUploade}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}
