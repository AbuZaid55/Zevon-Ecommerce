import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext } from 'react';
import { context } from '../Context/context';

const VerifyEmail = () => {
  const { setLoader2, getUser } = useContext(context)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation()
  const [code, setCode] = useState('')
  const [userId, setUserId] = useState()
  const [path, setPath] = useState('')

  const submitForm = async (e) => {
    setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/verifyEmail`, { otp: code, userId: userId })
      setCode()
      toast.success(res.data.massage)
      getUser()
      if (path === 'signup') {
        navigate('/login')
      }
      if (path === 'login') {
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }
  const resentVerificatonCode = async (e) => {
    setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/resentVerificatonCode`, { userId: userId })
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }

  useEffect(() => {
    if (location.state) {
      if (location.state.path) {
        setPath(location.state.path)
      }
      if (location.state.userId) {
        setUserId(location.state.userId)
      } else {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [])
  return (
    <>
      <div className='w-full flex items-center justify-center my-5'>
        <form className='w-full p-4 flex flex-col' onSubmit={(e) => { submitForm(e) }} style={{ maxWidth: '500px' }}>
          <h1 className='text-3xl text-center font-bold text-main-800 mb-3 mt-2 '>Verify your Email!</h1>
          <p className='text-center'>Please Enter 4-digit verification code that was send to your email id </p>
          <p className='text-center'>The code is valid for 30 minutes.</p>
          <label className='mt-3 text-main-800' htmlFor="code">Verification Code</label>
          <input className='w-full border-b border-main-800 mb-3 text-main-800' type="text" placeholder='Enter verification code' id='code' value={code} onChange={(e) => { setCode(e.target.value) }} />
          <div className='flex items-center justify-between'>
            <button className=' bg-main-800 text-white text-xl font-semibold py-2 px-4 mt-4 rounded-full whitespace-nowrap' onClick={(e) => { resentVerificatonCode(e) }}>Resend OTP</button>
            <button className=' bg-main-800 text-white text-xl font-semibold py-2 px-4 mt-4 rounded-full' type='submit'>Continue</button>
          </div>
        </form>
      </div>
    </>
  )
}
export default VerifyEmail
