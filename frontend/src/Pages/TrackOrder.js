import React,{useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const TrackOrder = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    const params = (useLocation().search);
    const [orderId,setOrderId]=useState('')
    const [track,setTrack]=useState(20)
    const [status,setStatus]=useState("")

  const fetchOrder = async(_id)=>{
    props.setLoader2(true)
    setStatus('')
    if(_id!==''){
      try {
        const res = await axios.post(`${BACKEND_URL}/order/trackOrder`,{orderId:_id})
        if(res.data && res.data.data){
          setStatus(res.data.data)
        }
      } catch (error) {
        toast.error(error.response.data.massage)
      }
    }else{
      toast.success("Enter Order Id")
    }
    props.setLoader2(false)
  }

   useEffect(()=>{
    if(params.includes('?orderId=')){
      const _id = params.slice(params.indexOf('=')+1)
      setOrderId(_id)
      fetchOrder(_id)
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
   },[params])
   useEffect(()=>{
    if(status==="Processing"){
      setTrack(15)
    }else if(status==="Confirmed"){
      setTrack(40)
    }else if(status==="Shipped"){
      setTrack(60)
    }else if(status==="Out For Delivery"){
      setTrack(80)
    }else if(status==="Delivered"){
      setTrack(100)
    }else if(status==="Cancelled"){
      setTrack(30)
    }else if(status==="Refund"){
      setTrack(100)
    }else{
      setTrack(0)
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
   },[status])
  return (
    <div className='flex items-center justify-center flex-col mt-8 sm:mt-0'>
      <h1 className='text-3xl text-main-800 mt-5 font-bold'>Track Your Order</h1>
      <div className={`${(status==="Cancelled" || status==='Refund')?'hidden':''} w-80 h-80 border-2 relative m-10`}>
        <div className='bg-gray-300 h-72  w-1 relative left-5 top-5'>
          <div className='w-full bg-green-700 absolute z-20' style={{height:`${track}%`}}></div>
          <div className='absolute z-30 w-full h-full flex items-center justify-between flex-col'>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=1)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=40)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=60)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=80)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=100)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
          </div>
          <div className='absolute text-lg left-10 w-64 h-full flex items-left justify-between flex-col '>
            <p>Processing</p>
            <p>Order Confirmed</p>
            <p>Shipped</p>
            <p>Out For Delivery</p>
            <p>Delivered</p>
          </div>
        </div>
      </div>
      <div className={`${(status==="Cancelled" || status==='Refund')?'':'hidden'} w-80 h-48 border-2 relative m-10`}>
        <div className='bg-gray-300 h-36  w-1 relative left-5 top-5'>
          <div className={`${(status==="Refund")?'bg-green-700':' bg-red-700'} w-full absolute z-20`} style={{height:`${track}%`}}></div>
          <div className='absolute z-30 w-full h-full flex items-center justify-between flex-col'>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=1)?'bg-red-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
            <p className={`w-6 h-6 font-bold rounded-full flex items-center justify-center ${(track>=40)?'bg-green-700 text-white':'bg-gray-300 text-black'}`}>&#10003;</p>
          </div>
          <div className='absolute text-lg left-10 w-64 h-full flex items-left justify-between flex-col '>
            <p>Cancelled</p>
            <p>Refund Successfull</p>
          </div>
        </div>
      </div>
      <div className='border flex justify-center flex-col p-5 w-80 mb-10'>
        <label className='text-xl mb-2' htmlFor="orderInput">Order Id</label>
        <input className='w-full border-b border-main-800' type="text" id='orderInput' placeholder='Enter your order id' value={orderId} onChange={(e)=>{setOrderId(e.target.value)}}/>
        <button className=' bg-main-800  px-4 py-2 text-white font-bold rounded-full mt-5' onClick={()=>{fetchOrder(orderId)}}>Track Order</button>
      </div>
    </div>
  )
}

export default TrackOrder 