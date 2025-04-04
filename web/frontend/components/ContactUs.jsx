import React, { useRef, useState } from 'react'
import { useAuthenticatedFetch } from '../hooks'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

export default function ContactUs() {
    const fetch=useAuthenticatedFetch()
    const StoreInfo=useSelector((state)=> state.StoreInfo.StoreDetail)
    const [formdata,setFormdata]=useState({
        amazonProduct:'',
        csvProduct:'',
        email:"",
        message:""
    })
    const modalRef = useRef(null); // Ref to store modal element
    const handleChange=(e)=>{
           
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })

    }
    const HandleSubmitCusotm=async(e)=>{
        try {
            e.preventDefault()
            const request= await fetch(`/api/billing/custompakage?StoreId=${StoreInfo._id}`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json", // Add this header to specify JSON content
                  },
                  body:JSON.stringify(formdata)
             })
             const respsone= await request.json()
             if (request.status === 200) {
               toast.success(respsone.message)
               setFormdata({
                amazonProduct:'',
                csvProduct:'',
                email:"",
                message:""
               })
           
             }
             console.log('cuostm ',respsone)
          
        } catch (error) {
            
        }
      
    }
  return (

<div className="">
<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Custom Plane</button>

    {/* modal here*/}
    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Contact Us</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form >
                <div className="mb-3">
                    <label for="amazon-import-product" className="col-form-label">Amazon import product</label>
                    <input type="number" onChange={handleChange} name='amazonProduct' value={formdata.amazonProduct} className="form-control" id="amazon-import-product" />
                </div>
                <div className="mb-3">
                    <label for="csv-file" className="col-form-label">CSV File Product</label>
                    <input type="number" onChange={handleChange} name='csvProduct' value={formdata.csvProduct} className="form-control" id="csv-file" />
                </div>
                <div className="mb-3">
                    <label for="email" className="col-form-label">Email</label>
                    <input type="email" value={formdata.email} name='email' onChange={handleChange} className="form-control" id="email" />
                </div>
                <div className="mb-3">
                    <label for="message-text" className="col-form-label">Message</label>
                    <textarea className="form-control" onChange={handleChange} value={formdata.message} name='message' id="message-text"></textarea>
                </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary"   data-bs-dismiss="modal" onClick={HandleSubmitCusotm}>Send message</button>
            </div>
            </div>
        </div>
        </div>
    {/* modal end */}
</div>

  )
}
