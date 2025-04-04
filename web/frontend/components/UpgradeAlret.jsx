import React from 'react';


export default function UpgradeAlert({ handleUpdate, title }) {
  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0" style={{ maxWidth: '500px' }}>
        <div className="card-body text-center p-4">
          <h4 className="card-title text-warning fw-bold fs-4">Upgrade Required</h4>
          <p className="card-text pt-2 fs-5 text-muted">{title}</p>
          <button className="btn btn-primary btn-lg mt-3" onClick={handleUpdate}>
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
