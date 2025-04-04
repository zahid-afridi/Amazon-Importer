
import React from 'react';
import LoadingBtn from './LoadingBtn';

export default function ExtensionChecModal({ title, imageUrl,description, HandleClick, handleCloseModal, loading, BtnText }) {
  return (
    <>
      <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
          <div className="modal-header">
              {/* <h5 className="modal-title">{title}</h5>               */}
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
             </div>
            <div className="modal-body ">
              <>
                 <div className='p-2 d-flex  gap-3  align-content-center'>
                  <div className=''>
                    <img src={imageUrl} alt="" className='img-fluid w-75' />
                  </div>
                  <div className='modalContent  d-flex flex-column gap-2' style={{width:'55rem'}}>
  <div className='textContainer'>
    <h2 className='fw-bold fs-5'>{title}</h2>
    <p className='mt-2'>{description}</p>
   
  </div>
</div>

                 </div>
              </>
            </div>
            <div className="modal-footer">
              {loading ? <LoadingBtn /> : <button type="button" className="btn btn-primary" onClick={HandleClick}>{BtnText}</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}