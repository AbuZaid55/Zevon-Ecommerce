import axios from 'axios'
import GoLogin from '../Component/GoLogin';
import React, { useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import BACKEND_URL from '../baseUrl'

const VerifyEmail = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [code,setCode]=useState('')
  const [userId,setUserId]=useState()
  const [path,setPath]=useState('')
  const [login,setLogin]=useState(false)
  
  const submitForm = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/verifyEmail`,{otp:code,userId:userId})
      setCode()
      alert(res.data.massage)
      if(path==='signup'){
        navigate('/login')
      }
      if(path==='login'){
        navigate('/')
      }
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  const resentVerificatonCode = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/resentVerificatonCode`,{userId:userId})
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
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
  useEffect(()=>{
    if(props.user._id){
      setLogin(true)
    }else{
      setLogin(false)
    }
  },[props.user])
  return (
   <>
   <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
  <div className={`${(login)?"":"hidden"}`}>
   <div className='w-full flex items-center justify-center my-5'>
      <form className='w-full sm:w-2/3 lg:w-1/3 p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}}>
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
   </div>
   </>
  )
}
export default VerifyEmail
