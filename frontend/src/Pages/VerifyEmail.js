import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import BACKEND_URL from '../baseUrl'
import { toast } from 'react-toastify'

const VerifyEmail = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [code,setCode]=useState('')
  const [userId,setUserId]=useState()
  const [path,setPath]=useState('')
  
  const submitForm = async(e)=>{
    props.setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/verifyEmail`,{otp:code,userId:userId})
      setCode()
      toast.success(res.data.massage)
      props.getUser()
      if(path==='signup'){
        navigate('/login')
      }
      if(path==='login'){
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }
  const resentVerificatonCode = async(e)=>{
    props.setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/resentVerificatonCode`,{userId:userId})
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }
  useEffect(()=>{
    if(location.state){
      if(location.state.userId){
        setUserId(location.state.userId)
      }
      if(location.state.path){
        setPath(location.state.path)
      }
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
   <>
   <div className='w-full flex items-center justify-center my-5'>
      <form className='w-full p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}} style={{maxWidth:'500px'}}>
            <h1 className='text-3xl text-center font-bold text-fuchsia-900 mb-3 mt-2 '>Verify your Email!</h1>
            <p className='text-center'>Please Enter 4-digit verification code that was send to your email id </p>
            <p className='text-center'>The code is valid for 30 minutes.</p>
            <label className='mt-3 text-fuchsia-950' htmlFor="code">Verification Code</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' type="text" placeholder='Enter verification code' id='code' value={code} onChange={(e)=>{setCode(e.target.value)}}/>
            <div className='flex items-center justify-between'>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 px-4 mt-4 rounded-full whitespace-nowrap' onClick={(e)=>{resentVerificatonCode(e)}}>Resend OTP</button>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 px-4 mt-4 rounded-full' type='submit'>Continue</button>
            </div>
        </form>
    </div>
   </>
  )
}
export default VerifyEmail
