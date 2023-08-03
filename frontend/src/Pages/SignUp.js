import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import BACKEND_URL from '../baseUrl';
import axios from 'axios'

const SignUp = (props) => {
  const navigate = useNavigate()
  const [newUser,setNewUser]=useState({name:"",email:"",password:"",confirm_pass:""})
  const handleInput = (e)=>{
    setNewUser({...newUser,[e.target.name]:e.target.value})
  }
  const submitForm = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signup`,newUser)
      setNewUser({name:"",email:"",password:"",confirm_pass:""})
      navigate('/verifyemail',{state:{userId:res.data.data._id,path:'signup'}})
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  const googleSignUp = async()=>{
    window.open(`${BACKEND_URL}/auth/google`,'_self')
  }
  return (
    <div className='w-full flex items-center justify-center my-5'>
      <div className='w-full md:w-1/3 p-4 flex flex-col'>
            <h1 className='text-3xl text-center font-bold text-fuchsia-900 mb-3 mt-2 border-b border-fuchsia-950 pb-3'>Sign Up</h1>
            <label className='mt-3 text-fuchsia-950' htmlFor="name">Name</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='name' type="text" placeholder='Enter your Name' id='name' value={newUser.name} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="email">Email</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='email' type="email" placeholder='Enter your email' id='email' value={newUser.email} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="password">Password (between 8 to 12 character)</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='password' type="text" placeholder='Enter password' id='password' value={newUser.password} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="confirm_pass">Confirm Password</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' type="text" name='confirm_pass' placeholder='Enter confirm password' id='confirm_pass' value={newUser.confirm_pass} onChange={(e)=>{handleInput(e)}}/>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' onClick={(e)=>{submitForm(e)}}>Sign Up</button>
            <button className=' bg-blue-600 text-white text-xl font-semibold py-2 mt-4 rounded-full flex items-center justify-center' onClick={()=>{googleSignUp()}}><FaGoogle className='mr-5' />Sign Up With Google</button>
            <span className=' mt-4 self-center'>Have an account? <span className=' text-fuchsia-700'><Link to="/login">Login</Link></span></span>
        </div>
    </div>
  )
}

export default SignUp
