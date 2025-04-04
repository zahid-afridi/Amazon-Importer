
import React, { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import toast from 'react-hot-toast';
import LoadingBtn from '../components/LoadingBtn';
import Spinner from '../components/Spinner';
import ProductModal from '../components/ProductModal';
import { useSelector } from 'react-redux';

export default function Products() {
  const fetch = useAuthenticatedFetch();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  const [productLoading, setProductLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [uploadingProducts, setUploadingProducts] = useState(new Set()); // Track uploading products

  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setSpinner(true);
        const request = await fetch(`/api/amazon/product/getProducts/${StoreInfo._id}`);
        const response = await request.json();
        if (request.ok) {
          setProducts(response);
          setSpinner(false);
        }
        setSpinner(false);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, [refreshState]);

  const SingProductUPloade = async (product) => {
    try {
      setUploadingProducts((prev) => new Set([...prev, product._id])); // Mark product as uploading
      setLoading(true);
      const request = await fetch('/api/product/addProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          image_url: product.image_url,
          price: product.price,
        }),
      });

      const response = await request.json();
      if (request.ok) {
        const shopifyId = response.product.id;
        await fetch(`/api/amazon/product/update/${product._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shopifyId: shopifyId,
          }),
        });
        toast.success(response.message);
        setLoading(false);
        setUploadingProducts((prev) => new Set([...prev].filter((id) => id !== product._id))); // Remove product from uploading
        setRefreshState(!refreshState);
      } else {
        toast.error('Failed to upload product to Shopify.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload product to Shopify. Please try again.');
    }
  };

  const handleSelectProduct = (product) => {
    if (!product.inShopify) {
      if (selectedProducts.some((p) => p._id === product._id)) {
        setSelectedProducts((prevSelected) => prevSelected.filter((p) => p._id !== product._id));
      } else {
        setSelectedProducts((prevSelected) => [...prevSelected, product]);
      }
    } else {
      toast.warning('You can only select uploaded products.');
    }
  };

  const handleUploadAll = async () => {
    try {
      setProductLoading(true);
      for (const product of selectedProducts) {
        const request = await fetch('/api/product/addProducts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: product.title,
            description: product.description,
            image_url: product.image_url,
            price: product.price,
          }),
        });
        const response = await request.json();
        if (request.ok) {
          const shopifyId = response.product.id;
          await fetch(`/api/amazon/product/update/${product._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shopifyId: shopifyId,
            }),
          });
        } else {
          toast.error('Failed to upload product to Shopify.');
        }
      }
      setRefreshState(!refreshState);
      toast.success('All products uploaded successfully');
      setProductLoading(false);
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload products to Shopify. Please try again.');
      setProductLoading(false);
    }
  };

  const handlView = (data) => {
    setModalData(data);
    setModal(true);
  };

  const handleDelet = async (data) => {
    try {
      const request = await fetch(`/api/product/delete/${data.shopifyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await request.json();
      if (request.ok) {
        toast.success(response.message);
        setRefreshState(!refreshState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (spinner) {
    return <Spinner />;
  }

  return (
    <div className="container-fluid">
      {products.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="row">
            <div className="col-12">
              <h1 className="fs-1">No Data</h1>
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className="mt-2">
            <div className="container-fluid mb-4">
              <div className="row mb-3">
                <div className="col-12 text-center">
                  <h1 className="fs-2 fw-bold">Manages Products</h1>
                </div>
              </div>
              <div className="mb-3 ">
                {productLoading ? (
                  <LoadingBtn />
                ) : (
                  <button
                    className="btn btn-primary   "
                    onClick={handleUploadAll}
                    disabled={loading || selectedProducts.length === 0}
                  >
                    Upload Selected
                  </button>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th className="text-center">
                        <input
                          type="checkbox"
                          onChange={() => setSelectedProducts([...products.filter((p) => !p.inShopify)])}
                          checked={
                            selectedProducts.length === products.filter((p) => !p.inShopify).length &&
                            products.filter((p) => !p.inShopify).length !== 0
                          }
                        />
                      </th>
                      <th className="text-center">Image</th>
                      <th className="text-center">Title</th>
                      <th className="text-center">Created at</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((elem, index) => (
                      <tr key={index}>
                        <td className="">
                          <input
                            type="checkbox"
                            onChange={() => handleSelectProduct(elem)}
                            disabled={elem.inShopify}
                            checked={selectedProducts.some((p) => p._id === elem._id)}
                          />
                        </td>
                        <td className="text-center">
                          <img
                            className="img-fluid"
                            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                            src={elem.image_url}
                            alt={elem.title}
                          />
                        </td>
                        <td className="w-50">{elem.title}</td>
                        <td className="text-center">
                          <div className="mt-4">
                            <h2 className="fs-6">{new Date(elem.createdAt).toLocaleDateString()}</h2>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className=" mt-4">
                            {elem.inShopify ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </div>
                        </td>
                        <td className=" text-center ">
                          {uploadingProducts.has(elem._id) ? (
                            <button className="btn btn-primary mt-3 btn-sm" disabled>
                              Uploading...
                            </button>
                          ) : elem.inShopify ? (
                            <div className="d-flex justify-content-around">
                              <button className="btn btn-secondary btn-sm mt-4" onClick={() => handlView(elem)}>
                                View
                              </button>
                              <button className="btn btn-danger btn-sm mt-4" onClick={() => handleDelet(elem)}>
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button className="btn btn-primary mt-3 btn-sm" onClick={() => SingProductUPloade(elem)}>
                              Upload
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {modal && (
              <ProductModal
                title={modalData.title}
                handleCloseModal={() => setModal(false)}
                BtnText={'Close'}
                description={modalData.description}
                price={modalData.price}
                imageUrl={modalData.image_url}
                HandleClick={() => setModal(false)}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

