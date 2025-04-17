import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAppBridge, useNavigate } from "@shopify/app-bridge-react";
import { updateAmzProduct, updateCsvProduct } from "../redux/UserStoreSlice";
import Spinner from "../components/Spinner";

export default function Pricing() {
  const bridge = useAppBridge();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  
  const [spinner, setSpinner] = useState(false);
  const [customProductCount, setCustomProductCount] = useState(0);
  const [customCsvProductCount,setCustomCsvProductCount]=useState(0)
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [pakages, setPakages] = useState([
    {
      packageName: "Basic",
      packagePrice: 5,
      packageAmazonImportNumber: 100,
      packageCsvImportNumber: 100,
      packageDesc: "Basic plan is limited to 100 Amazon products and 100 CSV products."
    },
    {
      packageName: "Standard",
      packagePrice: 10,
      packageAmazonImportNumber: 200,
      packageCsvImportNumber: 200,
      packageDesc: "Standard plan is limited to 200 Amazon products and 200 CSV products."
    },
    {
      packageName: "Pro",
      packagePrice: 20,
      packageAmazonImportNumber: 400,
      packageCsvImportNumber: 400,
      packageDesc: "Pro plan is limited to 400 Amazon products and 400 CSV products."
    }
  ]);

  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  const [storepyament, setStorepyament] = useState("");
  const [refreshstate, setRefreshstate] = useState(false);

  

  const handleCustomPurchase = () => {
    setShowCustomModal(true);
  };

  const handleCreateCustomPackage = () => {
    const customPackage = {
      packageName: "Custom",
      packagePrice: customProductCount * 1,
      packageAmazonImportNumber: customProductCount,
      packageCsvImportNumber: customCsvProductCount,
    };
    setPakages([...pakages, customPackage]);
    setShowCustomModal(false);
  };

  const handleBuy = async (elem) => {
    try {
      const data = {
        name: elem.packageName,
        price: elem.packagePrice,
        amazonProductNumber: elem.packageAmazonImportNumber,
        CsvProductNumber: elem.packageCsvImportNumber,
        retrun_url: `https://${StoreInfo.domain}/admin/apps/a50c9af86020e75e4680ddec886b0eec`,
      };
      if (elem.packagePrice == 0) {
        const request = await fetch(
          `/api/billing/freepakage?StoreId=${StoreInfo._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          navigate("/ImportLink");
          toast.success(response.message);
          setRefreshstate(!refreshstate);
        }
      } else {
        dispatch(updateAmzProduct(elem.packageAmazonImportNumber));
        dispatch(updateCsvProduct(elem.packageCsvImportNumber));
        const request = await fetch(
          `/api/billing/userpay?StoreId=${StoreInfo._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          window.open(response.confirmation_url);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (spinner) {
    return <Spinner />;
  }

  return (
    <>
      <section className="section" id="pricing">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h3 className="title-heading mt-4 fs-2 fw-bold">Choose Your Pricing Plan</h3>
            </div>
          </div>
          <div className="row mt-4 pt-4">
            {pakages.map((elem, index) => (
              <div className="col-lg-6" key={index}>
                <div className="pricing-box mt-4">
                  <h4 className="fs-2 fw-bold">{elem.packageName}</h4>
                  <div className="pricing-plan mt-4 pt-2">
                    <h4 className="text-muted">
                      <span className="plan pl-3 text-dark">${elem.packagePrice}</span>
                    </h4>
                  </div>
                  <p className="mb-2">Amazon Products Import: {elem.packageAmazonImportNumber}</p>
                  <p className="mb-2">Csv Import: {elem.packageCsvImportNumber}</p>
                  <div className="mt-4 pt-3">
                    <button className="btn btn-primary btn-rounded" onClick={() => handleBuy(elem)}>
                      {storepyament && storepyament.status === "active" ? "Purchase" : "Purchase Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-lg-4 mb-3">
              <div className="pricing-box mt-4">
                <h4 className="fs-2 fw-bold">Custom</h4>
                <div className="pricing-plan mt-4 pt-2">
                  <h4 className="text-muted">
                    <span className="fw-bold fs-6">Create Custom plan</span>
                  </h4>
                </div>
                <div className="mt-4 pt-3">
                  <button className="btn btn-success btn-rounded w-100 fs-6 h-50" onClick={handleCustomPurchase}>
                    Create Custom Package
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {showCustomModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Custom Package</h5>
                <button type="button" className="close" onClick={() => setShowCustomModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <label htmlFor="customProductCount" className="form-label">
    Enter Amazon Product Number
  </label>
                <input
                  type="number"
                  className="form-control mt-3"
                  value={customProductCount}
                  onChange={(e) => setCustomProductCount(Number(e.target.value))}
                  placeholder="Enter product count"
                />
                           <label htmlFor="customProductCount" className="form-label mt-3">
    Enter Csv Product Number
  </label>
                <input
                  type="number"
                  className="form-control mt-3"
                  value={customCsvProductCount}
                  onChange={(e) => setCustomCsvProductCount(Number(e.target.value))}
                  placeholder="Enter product count"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCustomModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateCustomPackage}>
                  Create Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
