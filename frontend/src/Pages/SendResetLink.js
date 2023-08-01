import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BACKEND_URL from '../baseUrl';
import axios from 'axios'

const SendResetLink = () => {
  const [email,setEmail]=useState('')
  
  const submitForm = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/sendResetLink`,{email:email})
      setEmail('')
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  return (
    <div className='w-full flex items-center justify-center my-5'>
      <form className='w-full md:w-1/3 p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}}>
            <h1 className='text-3xl text-center font-bold text-fuchsia-900 mb-3 mt-2 '>Change Password</h1>
            <p className='text-center'>Send link to your email id </p>
            <p className='text-center'>The link is valid for 30 minutes.</p>
            <label className='mt-3 text-fuchsia-950' htmlFor="email">Email</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='email' type="email" placeholder='Enter your email' id='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' type='submit'>Send Link</button>
            <div className='flex items-center justify-between px-3'>
            <span className=' mt-4'>Go to <span className=' text-fuchsia-700'><Link to="/signup">Sign Up</Link></span></span>
            <span className=' mt-4'>Go to <span className=' text-fuchsia-700'><Link to="/login">Log In</Link></span></span>
            </div>
        </form>
    </div>
  )
}

export default SendResetLink
