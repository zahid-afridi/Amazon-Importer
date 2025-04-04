import React from 'react';

export default function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
