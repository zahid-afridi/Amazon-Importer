import React from 'react';

export default function LoadingBtn() {
  return (
    <button className="btn btn-primary d-flex align-items-center" type="button" disabled>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Loading...
    </button>
  );
}
