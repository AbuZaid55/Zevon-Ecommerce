import React, { useState } from 'react'
import { FaStar,FaRupeeSign } from 'react-icons/fa';
import { Link, useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useContext } from "react";
import { context } from "../Context/context.js";

const Card = (props) => {
  const userId = props.userId
  const navigate = useNavigate()
  const location  = useLocation()
  const {getUser} = useContext(context)
  const fullPath= location.pathname+location.search
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const {_id,thumbnail,name,description,maxprice,sellprice,GST,deliveryCharge,reviews} = props.product

  const [rating,]=useState(()=>{
    let rat = 0
    reviews.map((review)=>{
      rat = rat+review.rating
    })
    if(reviews.length===0){
      return 0 
    }else{
      return (rat/reviews.length).toFixed(1)
    }
  })

  const addToCart = async()=>{
    if(!userId){
     navigate('/login',{state:{path:fullPath}})
    }else{
     try {
       const res = await axios.post(`${BACKEND_URL}/auth/addToCart`,{userId:userId,productId:_id,name:name,price:sellprice,thumbnail:thumbnail,size:'',qty:1,color:'',GST:GST,deliveryCharge:deliveryCharge},{withCredentials:true})
       getUser()
       toast.success(res.data.massage)
     } catch (error) {
       const massage = error.response.data.massage
       if(massage==='Invalid User'){
         navigate('/login',{state:{path:fullPath}})
       }else{
         toast.error(massage)
       }
     }
    }
   }
  return (
    <div className=' w-44 sm:w-52 md:w-60 lg:w-72 border border-hover-600 mt-2 lg:m-4 p-1 sm:p-4 rounded-md' >
        <div className='w-full h-40 sm:h-44 md:h-56 lg:h-64'><img className='min-h-full max-h-full w-full' src={thumbnail.secure_url} alt="Pic" /></div>
        <h1 className='text-lg lg:text-xl overflow-hidden whitespace-nowrap font-bold'>{name}</h1>
        <p className=' sm:text-lg whitespace-nowrap overflow-hidden'>{description}</p>
        <div className='flex items-center  '>
        <h1 className='flex items-center sm:text-lg lg:text-xl font-bold'><FaRupeeSign/> {sellprice} </h1>
        <div><span className=' line-through mx-1 hidden sm:inline-block'>{maxprice}</span><span className='font-bold mx-2 sm:mx-0 text-green-600'>off {Math.round((sellprice/maxprice)*100)}%</span></div>
        </div>
        <div className='flex items-center'><span className='flex items-center bg-green-600 text-white rounded px-1 my-1 lg:text-base '>{rating}<FaStar className='ml-1'/></span></div>
        <div className='flex items-center justify-between mt-2'>
        <Link to={`/details?_id=${_id}`}><button className=' text-xs lg:text-base bg-gray-400 text-white lg:px-3 px-2 py-2 rounded hover:shadow-lg transition-all' >More Details</button></Link>
        <button onClick={()=>{addToCart()}} className=' text-xs lg:text-base bg-main-800 text-white rounded lg:px-4 px-2 py-2 hover:shadow-lg transition-all'>Add to Cart</button>
        </div>
    </div>
  )
}

export default Card
