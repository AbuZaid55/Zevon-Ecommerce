import React, { useState } from 'react'
import { useLocation ,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ChangePass = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const token = new URLSearchParams(useLocation().search).get("token")
  const userId = new URLSearchParams(useLocation().search).get("id")
  const [data,setData]=useState({token:token,userId:userId,new_pass:"",confirm_pass:""})
  const handleInput = (e)=>{
    setData({...data,[e.target.name]:e.target.value}) 
  }
  const submitForm = async(e)=>{
    props.setLoader2(true)
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/changePass`,data)
      toast.success(res.data.massage)
      navigate('/')
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }
  return (
    <div className='w-full flex items-center justify-center my-5'>
    <form className='w-full p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}} style={{maxWidth:'500px'}}>
          <h1 className='text-3xl text-center font-bold text-main-800 mb-3 mt-2 border-b border-main-800 pb-3'>Change data</h1>
          <label className='mt-3 text-main-800' htmlFor="new_pass">New data</label>
          <input className='w-full border-b border-main-800 mb-3 text-main-800' name='new_pass' type="text" placeholder='Enter your new data' id='new_pass' value={data.new_pass} onChange={(e)=>{handleInput(e)}}/>
          <label className='mt-3 text-main-800' htmlFor="confirm_pass">Confirm data</label>
          <input className='w-full border-b border-main-800 mb-3 text-main-800' name='confirm_pass' type="text" placeholder='Enter your confirm data' id='confirm_pass' value={data.confirm_pass} onChange={(e)=>{handleInput(e)}}/>
          <button className=' bg-main-800 text-white text-xl font-semibold py-2 mt-4 rounded-full' type='submit'>Submit</button>
      </form>
  </div>
  )
}

export default ChangePass
