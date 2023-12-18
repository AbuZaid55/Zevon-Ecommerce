import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react';
import { context } from '../Context/context';

const SignUp = () => {
  const navigate = useNavigate()
  const { setLoader2 } = useContext(context)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", confirm_pass: "" })

  const handleInput = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }
  const submitForm = async (e) => {
    setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signup`, newUser)
      setNewUser({ name: "", email: "", password: "", confirm_pass: "" })
      navigate('/verifyemail', { state: { userId: res.data.data._id, path: 'signup' } })
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }
  const googleSignUp = async () => {
    window.open(`${BACKEND_URL}/auth/google`, '_self')
  }

  return (
    <div className='w-full flex items-center justify-center my-5'>
      <div className='w-full p-4 flex flex-col' style={{ maxWidth: '500px' }}>
        <h1 className='text-3xl text-center font-bold text-main-800 mb-3 mt-2 border-b border-main-800 pb-3'>Sign Up</h1>
        <label className='mt-3 text-main-800' htmlFor="name">Name</label>
        <input className='w-full border-b border-main-800 mb-3 text-main-800' name='name' type="text" placeholder='Enter your Name' id='name' value={newUser.name} onChange={(e) => { handleInput(e) }} />
        <label className='mt-3 text-main-800' htmlFor="email">Email</label>
        <input className='w-full border-b border-main-800 mb-3 text-main-800' name='email' type="email" placeholder='Enter your email' id='email' value={newUser.email} onChange={(e) => { handleInput(e) }} />
        <label className='mt-3 text-main-800' htmlFor="password">Password (between 8 to 12 character)</label>
        <input className='w-full border-b border-main-800 mb-3 text-main-800' name='password' type="text" placeholder='Enter password' id='password' value={newUser.password} onChange={(e) => { handleInput(e) }} />
        <label className='mt-3 text-main-800' htmlFor="confirm_pass">Confirm Password</label>
        <input className='w-full border-b border-main-800 mb-3 text-main-800' type="text" name='confirm_pass' placeholder='Enter confirm password' id='confirm_pass' value={newUser.confirm_pass} onChange={(e) => { handleInput(e) }} />
        <button className=' bg-main-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' onClick={(e) => { submitForm(e) }}>Sign Up</button>
        <button className=' bg-blue-600 text-white text-xl font-semibold py-2 mt-4 rounded-full flex items-center justify-center' onClick={() => { googleSignUp() }}><FaGoogle className='mr-5' />Sign Up With Google</button>
        <span className=' mt-4 self-center'>Have an account? <span className=' text-main-800'><Link to="/login">Login</Link></span></span>
      </div>
    </div>
  )
}

export default SignUp
