import React,{useEffect, useState} from 'react'

const TrackOrder = () => {
    const [orderId,setOrderId]=useState()
    const [track,setTrack]=useState(20)
    const [status,setStatus]=useState("Order Confirmed")
   useEffect(()=>{
     if(status==="Processing"){
      setTrack(15)
    }else if(status==="Order Confirmed"){
      setTrack(40)
    }else if(status==="Shipped"){
      setTrack(60)
    }else if(status==="Out For Delivery"){
      setTrack(80)
    }else if(status==="Delivered"){
      setTrack(100)
    }else{
      setTrack(0)
    }
   },[])
  return (
    <div className='flex items-center justify-center flex-col mt-8 sm:mt-0'>
      <h1 className='text-3xl text-fuchsia-800 mt-5 font-bold'>Track Your Order</h1>
      <div className='w-80 h-80 border-2 relative m-10'>
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
      <div className='border flex justify-center flex-col p-5 w-80 mb-10'>
        <label className='text-xl mb-2' htmlFor="orderInput">Order Id</label>
        <input className='w-full border-b border-fuchsia-950' type="text" id='orderInput' placeholder='Enter your order id' value={orderId} onChange={(e)=>{setOrderId(e.target.value)}}/>
        <button className=' bg-fuchsia-700  px-4 py-2 text-white font-bold rounded-full mt-5'>Track Order</button>
      </div>
    </div>
  )
}

export default TrackOrder 