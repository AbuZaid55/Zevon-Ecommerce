import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const SendResetLink = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const [email,setEmail]=useState('')
  
  const submitForm = async(e)=>{
    props.setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/sendResetLink`,{email:email})
      setEmail('')
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }
  return (
    <div className='w-full flex items-center justify-center my-5'>
      <form className='w-full p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}} style={{maxWidth:'500px'}}>
            <h1 className='text-3xl text-center font-bold text-main-800 mb-3 mt-2 '>Change Password</h1>
            <p className='text-center'>Send link to your email id </p>
            <p className='text-center'>The link is valid for 30 minutes.</p>
            <label className='mt-3 text-main-800' htmlFor="email">Email</label>
            <input className='w-full border-b border-main-800 mb-3 text-main-800' name='email' type="email" placeholder='Enter your email' id='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <button className=' bg-main-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' type='submit'>Send Link</button>
            <div className='flex items-center justify-between px-3'>
            <span className=' mt-4'>Go to <span className=' text-main-800'><Link to="/signup">Sign Up</Link></span></span>
            <span className=' mt-4'>Go to <span className=' text-main-800'><Link to="/login">Log In</Link></span></span>
            </div>
        </form>
    </div>
  )
}

export default SendResetLink
