import React from 'react'

export default function AlretBar({title}) {
  return (
    <div>
             <div className='container mt-5'>
        <div className='row'>
          <div className='col-12'>
          <div class="alert alert-success" role="alert">
         <h2 className='fs-5'> 
       {title}
         </h2>
</div>
          </div>
        </div>
       </div>
    </div>
  )
}
