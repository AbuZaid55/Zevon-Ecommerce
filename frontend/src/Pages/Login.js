import React, { useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import BACKEND_URL from '../baseUrl'
import axios from 'axios'

const Login = (prop) => {
  const location  = useLocation()
  const path = (location.state && location.state.path)?location.state.path:''
  const navigate = useNavigate()
  const [user,setUser]=useState({email:"",password:""})
  const handleInput = (e)=>{
    setUser({...user,[e.target.name]:e.target.value})
  }
  const submitForm = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`,user,{withCredentials:true})
      setUser({email:"",password:""})
      if(res.data.massage==="!verified"){
        alert("Otp has been sent to your email id")
        navigate('/verifyEmail',{state:{userId:res.data.data._id,path:'login'}})
      }else{
        prop.getUser()
        if(path===''){
          navigate('/')
        }else{
          navigate(path)
        }
      }
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  const googleLogin = async()=>{
    window.open(`${BACKEND_URL}/auth/google`,'_self')
  }
  return (
    <div className='w-full flex items-center justify-center my-5'>
      <div className='w-full md:w-1/3 p-4 flex flex-col'>
            <h1 className='text-3xl text-center font-bold text-fuchsia-900 mb-3 mt-2 border-b border-fuchsia-950 pb-3'>Log In</h1>
            <label className='mt-3 text-fuchsia-950' htmlFor="email">Email</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='email' type="email" placeholder='Enter your email' id='email' value={user.email} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="password">Password</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='password' type="text" placeholder='Enter password' id='password' value={user.password} onChange={(e)=>{handleInput(e)}}/>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' onClick={(e)=>{submitForm(e)}}>Log In</button>
            <button className=' bg-blue-600 text-white text-xl font-semibold py-2 mt-4 rounded-full flex items-center justify-center' onClick={()=>{googleLogin()}}><FaGoogle className='mr-5'/>Log In With Google</button>
            <div className='flex items-center justify-between px-3'>
            <span className=' mt-4'>Forgot Password? <span className=' text-fuchsia-700'><Link to="/sendresetlink">Click</Link></span></span>
            <span className=' mt-4'>New User? <span className=' text-fuchsia-700'><Link to="/signup">Sign Up</Link></span></span>
            </div>
        </div>
    </div>
  )
}

export default Login
