import React, { useEffect, useState } from "react";
import Csv from "../assets/images/csv.svg";
import Amz from "../assets/images/amazon-icon.svg";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";

export default function Index() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);

  const [loading, setLoading] = useState(false);
  const domainName = StoreInfo?.domain;
  const trimmedDomainName = domainName?.replace(".myshopify.com", "");

  const handleNavigate = () => {
    navigate("/ImportLink");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-5">
      <div className="shadow-lg p-5 bg-white rounded-4 text-center">
        <h1 className="fs-3 fw-bold text-uppercase text-primary">
          Amazon product importer
        </h1>
        {/* <h3 className="fs-5 mt-2 text-muted">
          Select your Import Source
        </h3> */}

        <div className="row mt-5 d-flex justify-content-center">
          <div
            className="col-lg-6 col-md-8"
            onClick={handleNavigate}
            style={{ cursor: "pointer" }}
          >
            <div
              className="card border-0 shadow-sm p-4 text-center"
              style={{ transition: "0.3s", borderRadius: "12px" }}
            >
              <img
                src={Amz}
                alt="Amazon"
                className="img-fluid mx-auto"
                style={{ width: "100px" }}
              />
              <h2 className="fs-4 fw-bold mt-3 text-dark">
                Import from Amazon
              </h2>
              <p className="text-muted mt-2">
                Import products directly from Amazon using a product URL.
              </p>
            </div>
          </div>

          {/* Uncomment if CSV upload is needed */}
          <div className="col-lg-6 col-md-8 mt-4 mt-lg-0" onClick={() => navigate('/UploadCSV')} style={{ cursor: 'pointer' }}>
            <div className="card border-0 shadow-sm p-4 text-center" style={{ transition: '0.3s', borderRadius: '12px' }}>
              <img src={Csv} alt="CSV" className="img-fluid mx-auto" style={{ width: '100px' }} />
              <h2 className="fs-4 fw-bold mt-3 text-dark">Upload CSV</h2>
              <p className="text-muted mt-2">Upload a CSV file with product ASINs for bulk import.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
