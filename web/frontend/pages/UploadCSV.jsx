import React, { useEffect, useRef, useState } from 'react';
import CsvIcon from '../assets/images/csv.svg';
import { useAuthenticatedFetch } from '../hooks';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import AlretBar from '../components/AlretBar';
import UpgradeAlret from '../components/UpgradeAlret';
import { useNavigate } from 'react-router-dom';
import csvtojson from 'csvtojson';

export default function UploadCSV() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const StoreInfo = useSelector((state) => state.StoreInfo.StoreDetail);
  const [storepyament, setStorepyament] = useState('');
  const [country, setCountry] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [apikey, setApikey] = useState('');
  const [refresh, setRefresh] = useState(false);
  const fetch = useAuthenticatedFetch();

  // Check local storage for upload status on component mount
  useEffect(() => {
    // const uploadStatus = localStorage.getItem('isUploading');
    // if (uploadStatus === 'true') {
    //   setIsUploading(true);
    // }

    const fetchData = async () => {
      setSpinner(true);
      try {
        const [storePaymentResponse, settingResponse] = await Promise.all([
          fetch(`/api/billing/storepyament?StoreId=${StoreInfo._id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`/api/setting/getSetting`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        const storePaymentData = await storePaymentResponse.json();
        const settingData = await settingResponse.json();
        setStorepyament(storePaymentData.StorePayment);

        if (settingData.success && settingData.Setting) {
          settingData.Setting.forEach((setting) => {
            if (setting.keyName === 'api_key') {
              setApikey(setting.keyValue);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
      setSpinner(false);
    };
    fetchData();
  }, [StoreInfo._id, refresh]);

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    const validFileExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (
      selectedFile &&
      (selectedFile.type === 'text/csv' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        validFileExtensions.includes(`.${fileExtension}`))
    ) {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid Excel or CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    } else if (!country) {
      toast.error('Please Select Country');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    const reader = new FileReader();
    setIsUploading(true);
  
    reader.onload = async (event) => {
      const csvData = event.target.result;
      try {
        const jsonArray = await csvtojson({ noheader: true, output: 'json' }).fromString(csvData);
        const dataToInsert = jsonArray.map((row) => ({ asin: row.field1 }));
  
        // Await the completion of the function to ensure state is updated afterwards
        await fetchAsinDataInBackground(dataToInsert);
        
        // Reset file and country after successful upload
        setFile(null);
        setCountry('');
        
      } catch (error) {
        toast.error('Error processing CSV: ' + error.message);
        setIsUploading(false);
      }
    };
  
    reader.onerror = (error) => {
      toast.error('Error reading file: ' + error.message);
      setIsUploading(false);
    };
  
    reader.readAsText(file);
  };
  
  const fetchAsinDataInBackground = async (dataToInsert) => {
    let completedRequests = 0;
    const totalRequests = dataToInsert.length; // Update this to reflect the number of requests you will make
  
    for (const item of dataToInsert) { // Use a for..of loop to await each request
      try {
        const response = await fetch(
          `/api/upload/file/?StoreId=${StoreInfo._id}&&key=${apikey}&&domain=${country}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asin: item.asin }),
          }
        );
  
        const data = await response.json();
        if (data.success) {
          toast.success(data.message, { duration: 4000 });
        } else {
          toast.error(data.message, { duration: 4000 });
        }
  
      } catch (error) {
        toast.error('Error fetching ASIN data: ' + error.message);
      } finally {
        completedRequests += 1;
        // Update state after all requests have completed
        if (completedRequests === totalRequests) {
          setIsUploading(false);
          setRefresh((prev) => !prev); // Trigger refresh
        }
      }
    }
  };
  

  const handleUpdate = () => {
    navigate('/Pricing');
  };

  if (typeof storepyament === 'undefined') {
    return <UpgradeAlret handleUpdate={handleUpdate} title={'Please purchase a plan to continue using the app.'} />;
  }

  if (storepyament && storepyament.CsvProductNumber == 0) {
    return (
      <UpgradeAlret title={'You have reached the limit of product imports. Please upgrade your plan to continue'} handleUpdate={handleUpdate} />
    );
  }

  if (spinner) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster />
  
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="row w-100">
          <div className="col-lg-8 col-md-10 col-12 mx-auto">
            <div className="card border-0 shadow-lg rounded-3">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 text-primary">Upload Your CSV File</h2>
                <p className="text-muted text-center mb-4">
                Please select the correct country that belongs to your ASIN. You can upload up to 100 ASINs at a time by providing a one-column CSV file; otherwise, it will not fetch the data
                </p>
  
                {/* Product Counter */}
                {storepyament &&  (
                  <div className="alert alert-info mb-4 text-center">
                    You have <strong>{storepyament.CsvProductNumber}</strong> Products Remaining
                  </div>
                )}
  
                {/* Form Group Container */}
                <div className="mb-4">
                  <label htmlFor="country" className="form-label">Select Amazon Market:</label>
                  <select
                    className="form-select"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select country</option>
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
  
                {/* File Upload Section */}
                <div className="mb-4">
                  <label className="form-label">Upload CSV File:</label>
                  <div className="input-group">
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls"
                      className="form-control-file d-none"
                      id="fileInput"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={handleChooseFileClick}
                    >
                      Choose File
                    </button>
                    {file && <span className="text-success">{file.name}</span>}
                  </div>
                  <small className="form-text text-muted">
                    Supported formats: .csv, .xlsx, .xls
                  </small>
                </div>
  
                {/* Upload Status Message */}
                {isUploading && (
                  <div className="alert alert-warning mb-3" role="alert">
                    Uploading in progress... You can leave this page.
                  </div>
                )}
  
                {/* Upload Button */}
                <button
                  type="button"
                  className={`btn btn-primary w-100 ${file && !isUploading ? '' : 'disabled'}`}
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? "Uploading..." : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Custom CSS */}
      <style jsx>{`
        .card {
          background-color: #ffffff;
        }
        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
        }
        .btn-outline-secondary:hover {
          background-color: #e2e2e2;
        }
      `}</style>
    </>
  );
  
  
  
  
  
  
}
