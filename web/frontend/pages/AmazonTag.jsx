import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthenticatedFetch } from '../hooks';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import LoadingBtn from '.././components/LoadingBtn'

export default function AmazonTag() {
  const fetch = useAuthenticatedFetch();
  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  const [country, setCountry] = useState("amazon.com");
  const [affiliateId, setAffiliateId] = useState("");
  const [loadeBtn,setLoadeBtn]=useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadeBtn(true)
      const request = await fetch(`/api/affiliate/create?StoreId=${StoreInfo._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CountryCode: country,
          Affiliate_id: affiliateId,
        }),
      });
      const response = await request.json();
      setLoadeBtn(false)

      console.log(response)
      if (response.success) {
        toast.success(response.message)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      alert('Error creating affiliate link');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h2 className="mb-0">Amazon Affiliate Details</h2>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="country" className="form-label">Country</label>
              <select
                className="form-select"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="amazon.com">Amazon US</option>
                <option value="amazon.ca">Amazon Canada</option>
                <option value="amazon.com.mx">Amazon Mexico</option>
                <option value="amazon.co.uk">Amazon UK</option>
                <option value="amazon.fr">Amazon France</option>
                <option value="amazon.de">Amazon Germany</option>
                <option value="amazon.it">Amazon Italy</option>
                <option value="amazon.es">Amazon Spain</option>
                <option value="amazon.in">Amazon India</option>
                <option value="amazon.jp">Amazon Japan</option>
                <option value="amazon.nl">Amazon Netherlands</option>
                <option value="amazon.com.tr">Amazon Turkey</option>
                <option value="amazon.sa">Amazon Saudi Arabia</option>
                <option value="amazon.ae">Amazon UAE</option>
                <option value="amazon.au">Amazon Australia</option>
                <option value="amazon.sg">Amazon Singapore</option>
                <option value="amazon.com.br">Amazon Brazil</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="associatedId" className="form-label">Affiliate ID / Associated ID</label>
              <input
                type="text"
                className="form-control"
                id="associatedId"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                placeholder="Enter your associated ID"
              />
            </div>
            <div className="card-footer text-end py-3">
              
              {loadeBtn ? <LoadingBtn/> :<button type="submit" className="btn btn-primary btn-lg">Submit</button> }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
